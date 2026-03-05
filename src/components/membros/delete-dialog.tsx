"use client";

import { Modal } from "@/components/ui/modal";
import { AlertTriangle } from "lucide-react";
import type { Membro } from "@/types";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  membro: Membro | null;
  loading?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  membro,
  loading = false,
}: DeleteDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Remover membro
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Tem certeza que deseja remover{" "}
              <span className="font-semibold text-gray-700 dark:text-slate-200">
                {membro?.nome}
              </span>
              ? Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Remover
          </button>
        </div>
      </div>
    </Modal>
  );
}
