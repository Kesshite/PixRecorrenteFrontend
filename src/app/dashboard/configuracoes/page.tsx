"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { obterEstabelecimento, atualizarEstabelecimento } from "@/lib/api/estabelecimento";
import { ApiError } from "@/lib/api/client";
import type { Estabelecimento } from "@/types";

// ---------- Skeleton ----------

function FieldSkeleton() {
  return <div className="h-10 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse" />;
}

function LabelSkeleton() {
  return <div className="h-4 w-24 bg-gray-100 dark:bg-slate-800 rounded animate-pulse mb-1.5" />;
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <LabelSkeleton />
      <FieldSkeleton />
      <LabelSkeleton />
      <FieldSkeleton />
    </div>
  );
}

// ---------- Helpers ----------

function planoBadgeClass(plano: string | null) {
  switch (plano) {
    case "Pro":
      return "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300";
    case "Business":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    case "Basico":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400";
  }
}

function statusBadgeClass(status: string | null) {
  switch (status) {
    case "Ativo":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Suspenso":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300";
    case "Cancelado":
      return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400";
  }
}

// ---------- Input components ----------

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hint?: string;
  required?: boolean;
  error?: string;
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  hint,
  required,
  error,
}: FieldProps) {
  const isLocked = disabled || readOnly;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={[
          "w-full px-3 py-2 rounded-lg border text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
          isLocked
            ? "bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed"
            : "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white",
          error ? "border-red-400 dark:border-red-500" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ---------- Page ----------

interface FormState {
  nome: string;
  documento: string;
  telefone: string;
  chavePix: string;
  logotipo: string;
}

interface FormErrors {
  nome?: string;
  documento?: string;
}

type ToastState = { type: "success" | "error"; message: string } | null;

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dados, setDados] = useState<Estabelecimento | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const [form, setForm] = useState<FormState>({
    nome: "",
    documento: "",
    telefone: "",
    chavePix: "",
    logotipo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    obterEstabelecimento()
      .then((est) => {
        setDados(est);
        setForm({
          nome: est.nome ?? "",
          documento: est.documento ?? "",
          telefone: est.telefone ?? "",
          chavePix: est.chavePix ?? "",
          logotipo: est.logotipo ?? "",
        });
      })
      .catch((err) => {
        const msg =
          err instanceof ApiError
            ? err.mensagem
            : "Não foi possível carregar os dados do estabelecimento.";
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório.";
    if (!form.documento.trim()) e.documento = "Documento é obrigatório.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setToast(null);
    try {
      const updated = await atualizarEstabelecimento({
        nome: form.nome.trim(),
        documento: form.documento.trim(),
        telefone: form.telefone.trim() || null,
        chavePix: form.chavePix.trim() || null,
        logotipo: form.logotipo.trim() || null,
      });
      setDados(updated);
      setToast({ type: "success", message: "Dados salvos com sucesso!" });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.mensagem
          : "Erro ao salvar. Tente novamente.";
      setToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  function setField(key: keyof FormState) {
    return (v: string) => {
      setForm((f) => ({ ...f, [key]: v }));
      if (errors[key as keyof FormErrors]) {
        setErrors((e) => ({ ...e, [key]: undefined }));
      }
    };
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Gerencie os dados do seu estabelecimento
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={[
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-sm border",
            toast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
          ].join(" ")}
        >
          {toast.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.message}
        </div>
      )}

      {/* Load error */}
      {loadError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} />
          {loadError}
        </div>
      )}

      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
        {/* Seção 1 — Dados do Estabelecimento */}
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Dados do Estabelecimento
          </h2>

          {loading ? (
            <SectionSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field
                  label="Nome"
                  id="nome"
                  value={form.nome}
                  onChange={setField("nome")}
                  placeholder="Nome do estabelecimento"
                  required
                  error={errors.nome}
                />
              </div>
              <Field
                label="Documento (CNPJ/CPF)"
                id="documento"
                value={form.documento}
                onChange={setField("documento")}
                placeholder="00.000.000/0001-00"
                required
                error={errors.documento}
              />
              <Field
                label="Email"
                id="email"
                value={dados?.email ?? ""}
                readOnly
                hint="O email não pode ser alterado."
              />
              <Field
                label="Telefone"
                id="telefone"
                value={form.telefone}
                onChange={setField("telefone")}
                placeholder="(11) 99999-9999"
              />
            </div>
          )}
        </div>

        {/* Seção 2 — Pix */}
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Pix
          </h2>

          {loading ? (
            <div className="space-y-4">
              <LabelSkeleton />
              <FieldSkeleton />
            </div>
          ) : (
            <Field
              label="Chave Pix"
              id="chavePix"
              value={form.chavePix}
              onChange={setField("chavePix")}
              placeholder="CPF, CNPJ, email, celular ou chave aleatória"
            />
          )}
        </div>

        {/* Seção 3 — Plano */}
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            Plano e Status
          </h2>

          {loading ? (
            <div className="flex gap-3">
              <div className="h-7 w-20 bg-gray-100 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="h-7 w-16 bg-gray-100 dark:bg-slate-800 rounded-full animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400 mr-2">Plano:</span>
                <span
                  className={[
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                    planoBadgeClass(dados?.plano ?? null),
                  ].join(" ")}
                >
                  {dados?.plano ?? "Freemium"}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400 mr-2">Status:</span>
                <span
                  className={[
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                    statusBadgeClass(dados?.status ?? null),
                  ].join(" ")}
                >
                  {dados?.status ?? "—"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer — Salvar */}
        <div className="p-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 dark:disabled:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Salvando…
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
