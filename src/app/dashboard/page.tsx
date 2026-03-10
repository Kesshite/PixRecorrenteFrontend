"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Hash,
  Users,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { obterResumo, listarTransacoes } from "@/lib/api/transacoes";
import { listarMembros } from "@/lib/api/membros";
import { listarCobrancas } from "@/lib/api/cobrancas";
import { CobrancaStatusBadge, TransacaoTipoBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ResumoFinanceiro, Transacao, Cobranca } from "@/types";
import type { MonthData } from "@/components/dashboard/RevenueChart";

// ---------- Dynamic import (SSR-safe) ----------

const RevenueChart = dynamic(
  () =>
    import("@/components/dashboard/RevenueChart").then((m) => m.RevenueChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
    ),
  }
);

// ---------- Types ----------

type Periodo = "mes_atual" | "30_dias" | "3_meses" | "personalizado";

const PERIODO_LABELS: Record<Periodo, string> = {
  mes_atual: "Mês atual",
  "30_dias": "Últimos 30 dias",
  "3_meses": "Últimos 3 meses",
  personalizado: "Personalizado",
};

// ---------- Helpers ----------

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  // YYYY-MM-DD format — parse directly to avoid timezone offset
  if (!dateStr.includes("T")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function getPeriodRange(
  periodo: Periodo,
  custom: { de: string; ate: string }
): { de: string; ate: string } {
  const now = new Date();
  switch (periodo) {
    case "mes_atual": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { de: start.toISOString(), ate: now.toISOString() };
    }
    case "30_dias": {
      const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { de: start.toISOString(), ate: now.toISOString() };
    }
    case "3_meses": {
      const start = new Date(
        now.getFullYear(),
        now.getMonth() - 3,
        now.getDate()
      );
      return { de: start.toISOString(), ate: now.toISOString() };
    }
    case "personalizado": {
      const de = custom.de
        ? new Date(custom.de).toISOString()
        : new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const ate = custom.ate
        ? new Date(custom.ate + "T23:59:59").toISOString()
        : now.toISOString();
      return { de, ate };
    }
  }
}

async function buildMonthlyChartData(): Promise<MonthData[]> {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    return {
      start,
      end,
      label: d.toLocaleString("pt-BR", { month: "short" }),
    };
  });

  const results = await Promise.all(
    months.map((m) =>
      obterResumo({
        de: m.start.toISOString(),
        ate: m.end.toISOString(),
      }).catch(() => ({
        totalRecebido: 0,
        totalEstornos: 0,
        saldo: 0,
        quantidadeTransacoes: 0,
        periodoInicio: "",
        periodoFim: "",
      }))
    )
  );

  return months.map((m, i) => ({
    mes: m.label,
    recebido: results[i].totalRecebido,
    estornos: results[i].totalEstornos,
  }));
}

// ---------- Sub-components ----------

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconBg,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  loading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400 truncate">
            {label}
          </p>
          {loading ? (
            <div className="h-7 w-28 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mt-2" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white truncate">
              {value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            iconBg
          )}
        >
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-gray-50 dark:border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function IndicatorRow({
  icon: Icon,
  iconBg,
  label,
  value,
  href,
  loading,
}: {
  icon: React.ElementType;
  iconBg: string;
  label: string;
  value: string;
  href: string;
  loading: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          iconBg
        )}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
        {loading ? (
          <div className="h-5 w-14 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mt-0.5" />
        ) : (
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        )}
      </div>
      <Link
        href={href}
        className="text-gray-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ExternalLink size={15} />
      </Link>
    </div>
  );
}

// ---------- Main Page ----------

export default function DashboardPage() {
  const { user } = useAuth();

  // Period state
  const [periodo, setPeriodo] = useState<Periodo>("mes_atual");
  const [customDe, setCustomDe] = useState("");
  const [customAte, setCustomAte] = useState("");

  // Summary cards
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [resumoLoading, setResumoLoading] = useState(true);

  // Monthly chart
  const [chartData, setChartData] = useState<MonthData[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Quick indicators
  const [membrosAtivos, setMembrosAtivos] = useState<number | null>(null);
  const [cobrancasPendentes, setCobrancasPendentes] = useState<number | null>(null);
  const [taxaInadimplencia, setTaxaInadimplencia] = useState<number | null>(null);
  const [indicadoresLoading, setIndicadoresLoading] = useState(true);

  // Recent lists
  const [cobrancasRecentes, setCobrancasRecentes] = useState<Cobranca[]>([]);
  const [transacoesRecentes, setTransacoesRecentes] = useState<Transacao[]>([]);
  const [recentesLoading, setRecentesLoading] = useState(true);

  // Load summary based on selected period
  const carregarResumo = useCallback(async () => {
    setResumoLoading(true);
    try {
      const range = getPeriodRange(periodo, { de: customDe, ate: customAte });
      const res = await obterResumo(range);
      setResumo(res);
    } catch {
      // silently fail — auth errors already handled by apiFetch
    } finally {
      setResumoLoading(false);
    }
  }, [periodo, customDe, customAte]);

  // Monthly chart — always last 6 months, loads once
  const carregarChart = useCallback(async () => {
    setChartLoading(true);
    try {
      const data = await buildMonthlyChartData();
      setChartData(data);
    } catch {
      // silently fail
    } finally {
      setChartLoading(false);
    }
  }, []);

  // Indicators — membros ativos, cobranças pendentes, inadimplência
  const carregarIndicadores = useCallback(async () => {
    setIndicadoresLoading(true);
    try {
      const [ativos, pendentes, inadimplentes, total] = await Promise.all([
        listarMembros({ status: "Ativo", porPagina: 1 }),
        listarCobrancas({ status: "Pendente", porPagina: 1 }),
        listarMembros({ status: "Inadimplente", porPagina: 1 }),
        listarMembros({ porPagina: 1 }),
      ]);
      setMembrosAtivos(ativos.total);
      setCobrancasPendentes(pendentes.total);
      const taxa =
        total.total > 0 ? (inadimplentes.total / total.total) * 100 : 0;
      setTaxaInadimplencia(Math.round(taxa * 10) / 10);
    } catch {
      // silently fail
    } finally {
      setIndicadoresLoading(false);
    }
  }, []);

  // Recent cobranças and transações
  const carregarRecentes = useCallback(async () => {
    setRecentesLoading(true);
    try {
      const [cobs, trans] = await Promise.all([
        listarCobrancas({ porPagina: 5 }),
        listarTransacoes({ porPagina: 5 }),
      ]);
      setCobrancasRecentes(cobs.items);
      setTransacoesRecentes(trans.items);
    } catch {
      // silently fail
    } finally {
      setRecentesLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  useEffect(() => {
    carregarChart();
  }, [carregarChart]);

  useEffect(() => {
    carregarIndicadores();
  }, [carregarIndicadores]);

  useEffect(() => {
    carregarRecentes();
  }, [carregarRecentes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Olá, {user?.nome ?? ""}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Resumo financeiro do seu estabelecimento.
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PERIODO_LABELS) as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg font-medium transition-colors",
                periodo === p
                  ? "bg-emerald-600 text-white dark:bg-emerald-500"
                  : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              )}
            >
              {PERIODO_LABELS[p]}
            </button>
          ))}
        </div>

        {periodo === "personalizado" && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-gray-400 dark:text-slate-500 shrink-0" />
              <label className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                De:
              </label>
              <input
                type="date"
                value={customDe}
                onChange={(e) => setCustomDe(e.target.value)}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                Até:
              </label>
              <input
                type="date"
                value={customAte}
                onChange={(e) => setCustomAte(e.target.value)}
                className="px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Recebido"
          value={resumo ? formatBRL(resumo.totalRecebido) : "R$ 0,00"}
          icon={TrendingUp}
          iconBg="bg-emerald-600 dark:bg-emerald-500"
          loading={resumoLoading}
        />
        <SummaryCard
          label="Total Estornos"
          value={resumo ? formatBRL(resumo.totalEstornos) : "R$ 0,00"}
          icon={TrendingDown}
          iconBg="bg-red-500 dark:bg-red-600"
          loading={resumoLoading}
        />
        <SummaryCard
          label="Saldo Líquido"
          value={resumo ? formatBRL(resumo.saldo) : "R$ 0,00"}
          icon={DollarSign}
          iconBg="bg-blue-600 dark:bg-blue-500"
          loading={resumoLoading}
        />
        <SummaryCard
          label="Transações no Período"
          value={resumo ? String(resumo.quantidadeTransacoes) : "0"}
          icon={Hash}
          iconBg="bg-slate-600 dark:bg-slate-500"
          loading={resumoLoading}
        />
      </div>

      {/* Revenue Chart + Quick Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Receita mensal (últimos 6 meses)
          </h2>
          <RevenueChart data={chartData} loading={chartLoading} />
        </div>

        {/* Quick indicators */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Indicadores
          </h2>
          <div className="space-y-4">
            <IndicatorRow
              icon={Users}
              iconBg="bg-emerald-600 dark:bg-emerald-500"
              label="Membros ativos"
              value={membrosAtivos !== null ? String(membrosAtivos) : "—"}
              href="/dashboard/membros"
              loading={indicadoresLoading}
            />
            <div className="border-t border-gray-100 dark:border-slate-800" />
            <IndicatorRow
              icon={Clock}
              iconBg="bg-yellow-500 dark:bg-yellow-600"
              label="Cobranças pendentes"
              value={cobrancasPendentes !== null ? String(cobrancasPendentes) : "—"}
              href="/dashboard/cobrancas"
              loading={indicadoresLoading}
            />
            <div className="border-t border-gray-100 dark:border-slate-800" />
            <IndicatorRow
              icon={AlertCircle}
              iconBg="bg-red-500 dark:bg-red-600"
              label="Taxa de inadimplência"
              value={taxaInadimplencia !== null ? `${taxaInadimplencia}%` : "—"}
              href="/dashboard/membros"
              loading={indicadoresLoading}
            />
          </div>
        </div>
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent cobranças */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Cobranças recentes
            </h2>
            <Link
              href="/dashboard/cobrancas"
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
            >
              Ver todas
              <ChevronRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50">
                  {["Membro", "Valor", "Vencimento", "Status"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} cols={4} />
                  ))
                ) : cobrancasRecentes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-400 dark:text-slate-500"
                    >
                      Nenhuma cobrança registrada.
                    </td>
                  </tr>
                ) : (
                  cobrancasRecentes.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[120px] truncate">
                        {c.nomeMembro || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">
                        {formatBRL(c.valor)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(c.dataVencimento)}
                      </td>
                      <td className="px-4 py-3">
                        <CobrancaStatusBadge status={c.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent transações */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Transações recentes
            </h2>
            <Link
              href="/dashboard/transacoes"
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1"
            >
              Ver todas
              <ChevronRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/50">
                  {["Membro", "Valor", "Tipo", "Data"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} cols={4} />
                  ))
                ) : transacoesRecentes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-400 dark:text-slate-500"
                    >
                      Nenhuma transação registrada.
                    </td>
                  </tr>
                ) : (
                  transacoesRecentes.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[120px] truncate">
                        {t.nomeMembro || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            t.tipo === "Credito"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {t.tipo === "Estorno" ? "- " : "+ "}
                          {formatBRL(t.valor)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <TransacaoTipoBadge tipo={t.tipo} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(t.criadoEm)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
