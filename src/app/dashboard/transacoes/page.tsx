"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Hash,
} from "lucide-react";
import { TransacaoTipoBadge } from "@/components/ui/badge";
import { listarTransacoes, obterResumo } from "@/lib/api/transacoes";

const POR_PAGINA = 10;
import { cn } from "@/lib/utils";
import type { Transacao, TipoTransacao, ResumoFinanceiro } from "@/types";

// ---------- Helpers ----------

const TIPO_OPTIONS: TipoTransacao[] = ["Credito", "Estorno"];

const TIPO_LABELS: Record<TipoTransacao, string> = {
  Credito: "Crédito",
  Estorno: "Estorno",
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMonthRange(): { de: string; ate: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    de: start.toISOString(),
    ate: now.toISOString(),
  };
}

// ---------- Summary Cards ----------

function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            color
          )}
        >
          <Icon size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400 truncate">
            {label}
          </p>
          {loading ? (
            <div className="h-6 w-24 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Pagination ----------

function Pagination({
  pagina,
  totalPaginas,
  total,
  porPagina,
  onChange,
}: {
  pagina: number;
  totalPaginas: number;
  total: number;
  porPagina: number;
  onChange: (p: number) => void;
}) {
  const start = (pagina - 1) * porPagina + 1;
  const end = Math.min(pagina * porPagina, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-800">
      <p className="text-xs text-gray-500 dark:text-slate-400">
        {total === 0
          ? "Nenhum resultado"
          : `Mostrando ${start}–${end} de ${total}`}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(pagina - 1)}
          disabled={pagina <= 1}
          className="p-1.5 rounded-md text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .filter(
            (p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1
          )
          .reduce<(number | "...")[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((item, i) =>
            item === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2 text-gray-400 dark:text-slate-500 text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onChange(item as number)}
                className={cn(
                  "w-8 h-8 rounded-md text-sm font-medium transition-colors",
                  item === pagina
                    ? "bg-emerald-600 text-white dark:bg-emerald-500"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                )}
              >
                {item}
              </button>
            )
          )}
        <button
          onClick={() => onChange(pagina + 1)}
          disabled={pagina >= totalPaginas}
          className="p-1.5 rounded-md text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------- Skeleton row ----------

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 dark:border-slate-800">
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ---------- Main Page ----------

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [tipoFiltro, setTipoFiltro] = useState<TipoTransacao | "">("");
  const [loading, setLoading] = useState(true);

  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [resumoLoading, setResumoLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listarTransacoes({
        pagina,
        porPagina: POR_PAGINA,
        tipo: tipoFiltro || undefined,
      });
      setTransacoes(res.items);
      setTotal(res.total);
      setTotalPaginas(res.totalPaginas);
    } catch {
      // erro de rede ou 401 — já tratado pelo apiFetch (redirect login)
    } finally {
      setLoading(false);
    }
  }, [pagina, tipoFiltro]);

  const carregarResumo = useCallback(async () => {
    setResumoLoading(true);
    try {
      const range = getMonthRange();
      const res = await obterResumo({ de: range.de, ate: range.ate });
      setResumo(res);
    } catch {
      // silently fail
    } finally {
      setResumoLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Transações
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Extrato financeiro do seu estabelecimento.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Recebido no mês"
          value={resumo ? formatBRL(resumo.totalRecebido) : "R$ 0,00"}
          icon={TrendingUp}
          color="bg-emerald-600 dark:bg-emerald-500"
          loading={resumoLoading}
        />
        <SummaryCard
          label="Estornos no mês"
          value={resumo ? formatBRL(resumo.totalEstornos) : "R$ 0,00"}
          icon={TrendingDown}
          color="bg-red-500 dark:bg-red-600"
          loading={resumoLoading}
        />
        <SummaryCard
          label="Saldo líquido"
          value={resumo ? formatBRL(resumo.saldo) : "R$ 0,00"}
          icon={DollarSign}
          color="bg-blue-600 dark:bg-blue-500"
          loading={resumoLoading}
        />
        <SummaryCard
          label="Total de transações"
          value={String(total)}
          icon={Hash}
          color="bg-slate-600 dark:bg-slate-500"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={tipoFiltro}
          onChange={(e) => {
            setTipoFiltro(e.target.value as TipoTransacao | "");
            setPagina(1);
          }}
          className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-shadow"
        >
          <option value="">Todos os tipos</option>
          {TIPO_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {TIPO_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                {["Membro", "Valor", "Tipo", "Data"].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : transacoes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-sm text-gray-400 dark:text-slate-500"
                  >
                    {tipoFiltro
                      ? "Nenhuma transação encontrada com o filtro aplicado."
                      : "Nenhuma transação registrada ainda."}
                  </td>
                </tr>
              ) : (
                transacoes.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t.nomeMembro || "—"}
                      </p>
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
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                      {formatDateTime(t.criadoEm)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && total > 0 && (
          <Pagination
            pagina={pagina}
            totalPaginas={totalPaginas}
            total={total}
            porPagina={POR_PAGINA}
            onChange={setPagina}
          />
        )}
      </div>
    </div>
  );
}
