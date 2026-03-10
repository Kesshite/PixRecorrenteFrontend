"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface MonthData {
  mes: string;
  recebido: number;
  estornos: number;
}

interface RevenueChartProps {
  data: MonthData[];
  loading: boolean;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-sm text-gray-400 dark:text-slate-500">
          Carregando gráfico...
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
        <XAxis
          dataKey="mes"
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => {
            const num = Number(v);
            if (num >= 1000) return `R$${(num / 1000).toFixed(0)}k`;
            return `R$${num.toFixed(0)}`;
          }}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip
          formatter={(value, name) => [
            formatBRL(Number(value)),
            name === "recebido" ? "Recebido" : "Estornos",
          ]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid rgba(148,163,184,0.3)",
            fontSize: "13px",
          }}
        />
        <Legend
          formatter={(value) => (value === "recebido" ? "Recebido" : "Estornos")}
          wrapperStyle={{ fontSize: "12px" }}
        />
        <Bar dataKey="recebido" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="estornos" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
