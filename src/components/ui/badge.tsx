import { cn } from "@/lib/utils";
import type { StatusMembro } from "@/types";

const variants: Record<StatusMembro, string> = {
  Ativo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  Pausado:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
  Inadimplente:
    "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  Cancelado:
    "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400",
};

interface StatusBadgeProps {
  status: StatusMembro;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
        variants[status],
        className
      )}
    >
      {status}
    </span>
  );
}
