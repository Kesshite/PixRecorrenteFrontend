import { Users, Clock } from "lucide-react";

export default function MembrosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Membros</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Gerencie os membros do seu estabelecimento.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users size={28} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Clock size={16} className="text-gray-400 dark:text-slate-500" />
          Em breve
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
          A gestão de membros está sendo desenvolvida. Em breve você poderá cadastrar,
          editar e acompanhar o status de cada membro.
        </p>
      </div>
    </div>
  );
}
