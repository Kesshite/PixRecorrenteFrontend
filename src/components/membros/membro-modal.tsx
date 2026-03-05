"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { Membro, CriarMembroBody } from "@/types";

interface FormState {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  nomePlano: string;
  valorMensal: string;
  diaVencimento: string;
  tags: string;
}

interface FormErrors {
  nome?: string;
  valorMensal?: string;
  diaVencimento?: string;
}

const emptyForm: FormState = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  nomePlano: "",
  valorMensal: "",
  diaVencimento: "",
  tags: "",
};

function membroToForm(m: Membro): FormState {
  return {
    nome: m.nome,
    cpf: m.cpf ?? "",
    telefone: m.telefone ?? "",
    email: m.email ?? "",
    nomePlano: m.nomePlano ?? "",
    valorMensal: m.valorMensal.toString(),
    diaVencimento: m.diaVencimento.toString(),
    tags: m.tags ?? "",
  };
}

function validate(form: FormState): FormErrors {
  const erros: FormErrors = {};
  if (!form.nome.trim()) erros.nome = "Nome é obrigatório.";
  const valor = parseFloat(form.valorMensal.replace(",", "."));
  if (!form.valorMensal || isNaN(valor) || valor <= 0)
    erros.valorMensal = "Informe um valor maior que zero.";
  const dia = parseInt(form.diaVencimento, 10);
  if (!form.diaVencimento || isNaN(dia) || dia < 1 || dia > 28)
    erros.diaVencimento = "Informe um dia entre 1 e 28.";
  return erros;
}

interface MembroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (body: CriarMembroBody) => void;
  membro?: Membro | null;
  loading?: boolean;
}

export function MembroModal({
  isOpen,
  onClose,
  onSubmit,
  membro,
  loading = false,
}: MembroModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [erros, setErros] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setForm(membro ? membroToForm(membro) : emptyForm);
      setErros({});
    }
  }, [isOpen, membro]);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (erros[field as keyof FormErrors]) {
      setErros((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validacao = validate(form);
    if (Object.keys(validacao).length > 0) {
      setErros(validacao);
      return;
    }
    const body: CriarMembroBody = {
      nome: form.nome.trim(),
      cpf: form.cpf.trim() || null,
      telefone: form.telefone.trim() || null,
      email: form.email.trim() || null,
      nomePlano: form.nomePlano.trim() || null,
      valorMensal: parseFloat(form.valorMensal.replace(",", ".")),
      diaVencimento: parseInt(form.diaVencimento, 10),
      tags: form.tags.trim() || null,
    };
    onSubmit(body);
  }

  const titulo = membro ? "Editar Membro" : "Novo Membro";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
          {titulo}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Dados pessoais */}
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            Dados pessoais
          </p>

          <Field label="Nome *" error={erros.nome}>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="Nome completo"
              className={inputClass(!!erros.nome)}
              disabled={loading}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="CPF" error={undefined}>
              <input
                type="text"
                value={form.cpf}
                onChange={(e) => set("cpf", e.target.value)}
                placeholder="000.000.000-00"
                className={inputClass(false)}
                disabled={loading}
              />
            </Field>
            <Field label="Telefone" error={undefined}>
              <input
                type="text"
                value={form.telefone}
                onChange={(e) => set("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
                className={inputClass(false)}
                disabled={loading}
              />
            </Field>
          </div>

          <Field label="E-mail" error={undefined}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="email@exemplo.com"
              className={inputClass(false)}
              disabled={loading}
            />
          </Field>

          {/* Dados do plano */}
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 pt-1">
            Plano
          </p>

          <Field label="Nome do plano" error={undefined}>
            <input
              type="text"
              value={form.nomePlano}
              onChange={(e) => set("nomePlano", e.target.value)}
              placeholder="Ex: Musculação, Natação..."
              className={inputClass(false)}
              disabled={loading}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor mensal (R$) *" error={erros.valorMensal}>
              <input
                type="text"
                inputMode="decimal"
                value={form.valorMensal}
                onChange={(e) => set("valorMensal", e.target.value)}
                placeholder="0,00"
                className={inputClass(!!erros.valorMensal)}
                disabled={loading}
              />
            </Field>
            <Field label="Dia de vencimento *" error={erros.diaVencimento}>
              <input
                type="number"
                value={form.diaVencimento}
                onChange={(e) => set("diaVencimento", e.target.value)}
                placeholder="1 – 28"
                min={1}
                max={28}
                className={inputClass(!!erros.diaVencimento)}
                disabled={loading}
              />
            </Field>
          </div>

          <Field label="Tags" error={undefined}>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="vip, mensal, personal (separadas por vírgula)"
              className={inputClass(false)}
              disabled={loading}
            />
          </Field>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {membro ? "Salvar alterações" : "Cadastrar membro"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-gray-900 dark:text-white",
    "placeholder:text-gray-400 dark:placeholder:text-slate-500",
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    hasError
      ? "border-red-400 dark:border-red-500"
      : "border-gray-200 dark:border-slate-700",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}
