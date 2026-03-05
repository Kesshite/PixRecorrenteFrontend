"use client";

import { Users, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const summaryCards = [
  {
    label: "Total de Membros",
    value: "—",
    sub: "Em breve",
    icon: Users,
    color: "emerald",
  },
  {
    label: "Recebido no Mês",
    value: "—",
    sub: "Em breve",
    icon: TrendingUp,
    color: "emerald",
  },
  {
    label: "Inadimplência",
    value: "—",
    sub: "Em breve",
    icon: AlertTriangle,
    color: "amber",
  },
  {
    label: "Cobranças Pendentes",
    value: "—",
    sub: "Em breve",
    icon: Clock,
    color: "blue",
  },
] as const;

const colorMap = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  },
};

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Boas-vindas */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Olá, {user?.nome ?? ""}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Aqui está o resumo do seu estabelecimento.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, sub, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{sub}</p>
                </div>
                <div className={`p-3 rounded-xl ${c.bg}`}>
                  <Icon size={22} className={c.icon} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp size={28} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Dashboard em construção
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
          Os dados reais aparecerão aqui quando a integração com a API estiver completa.
          Por enquanto, comece adicionando seus membros.
        </p>
      </div>
    </div>
  );
}
