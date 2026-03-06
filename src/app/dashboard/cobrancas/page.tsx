"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { CobrancaStatusBadge } from "@/components/ui/badge";
import {
  listarCobrancas,
  criarCobranca,
  cancelarCobranca,
} from "@/lib/api/cobrancas";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Cobranca, StatusCobranca, CriarCobrancaBody } from "@/types";

// ---------- Helpers ----------

const STATUS_OPTIONS: StatusCobranca[] = [
  "Pendente",
  "Paga",
  "Vencida",
  "Cancelada",
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string) {
  // YYYY-MM-DD → DD/MM/YYYY
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ---------- Form ----------

interface FormState {
  membroId: string;
  valor: string;
  dataVencimento: string;
}

interface FormErrors {
  membroId?: string;
  valor?: string;
}

function emptyForm(): FormState {
  return { membroId: "", valor: "", dataVencimento: "" };
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.membroId.trim()) errors.membroId = "ID do membro é obrigatório";
  if (form.valor) {
    const v = parseFloat(form.valor);
    if (isNaN(v) || v <= 0) errors.valor = "Informe um valor maior que zero";
  }
  return errors;
}

function toBody(form: FormState): CriarCobrancaBody {
  const body: CriarCobrancaBody = { membroId: form.membroId.trim() };
  if (form.valor.trim()) body.valor = parseFloat(form.valor);
  if (form.dataVencimento.trim()) body.dataVencimento = form.dataVencimento;
  return body;
}

// ---------- Field / Input helpers ----------

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
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

function TextInput({
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  step,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      step={step}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-shadow"
    />
  );
}

// ---------- CobrancaForm ----------

interface CobrancaFormProps {
  loading: boolean;
  apiError?: string;
  onSubmit: (body: CriarCobrancaBody) => void;
  onCancel: () => void;
}

function CobrancaForm({ loading, apiError, onSubmit, onCancel }: CobrancaFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<FormErrors>({});

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(toBody(form));
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
        Nova Cobrança
      </h2>

      <Field label="ID do Membro *" error={errors.membroId}>
        <TextInput
          value={form.membroId}
          onChange={(v) => set("membroId", v)}
          placeholder="UUID do membro"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Valor (R$)" error={errors.valor}>
          <TextInput
            type="number"
            min="0.01"
            step="0.01"
            value={form.valor}
            onChange={(v) => set("valor", v)}
            placeholder="Padrão do plano"
          />
        </Field>
        <Field label="Data de Vencimento">
          <TextInput
            type="date"
            value={form.dataVencimento}
            onChange={(v) => set("dataVencimento", v)}
          />
        </Field>
      </div>

      {apiError && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
          {apiError}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Gerando..." : "Gerar Cobrança"}
        </button>
      </div>
    </form>
  );
}

// ---------- CancelDialog ----------

function CancelDialog({
  cobranca,
  loading,
  onConfirm,
  onCancel,
}: {
  cobranca: Cobranca | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal isOpen={!!cobranca} onClose={onCancel}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Cancelar cobrança
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
          Tem certeza que deseja cancelar a cobrança de{" "}
          <strong className="text-gray-800 dark:text-white font-semibold">
            {cobranca ? formatBRL(cobranca.valor) : ""}
          </strong>{" "}
          para{" "}
          <strong className="text-gray-800 dark:text-white font-semibold">
            {cobranca?.nomeMembro}
          </strong>
          ? Essa ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Cancelando..." : "Cancelar cobrança"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------- ActionsMenu ----------

function ActionsMenu({
  cobranca,
  onCancelar,
}: {
  cobranca: Cobranca;
  onCancelar: (c: Cobranca) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const canCancel = cobranca.status === "Pendente";

  function handleOpen() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setOpen(true);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleScroll() {
      setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  if (!canCancel) {
    return (
      <span className="p-1.5 text-gray-300 dark:text-slate-600 cursor-default">
        <MoreVertical size={16} />
      </span>
    );
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-1.5 rounded-md text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
        title="Ações"
      >
        <MoreVertical size={16} />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: pos.top, right: pos.right }}
            className="z-[9999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg min-w-[180px] py-1"
          >
            <button
              onClick={() => {
                onCancelar(cobranca);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              Cancelar cobrança
            </button>
          </div>,
          document.body
        )}
    </>
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
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ---------- Main Page ----------

export default function CobrancasPage() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusCobranca | "">("");
  const [loading, setLoading] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formApiError, setFormApiError] = useState<string | undefined>(undefined);

  const [confirmCancelar, setConfirmCancelar] = useState<Cobranca | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);

  const POR_PAGINA = 10;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listarCobrancas({
        pagina,
        porPagina: POR_PAGINA,
        busca,
        status: statusFiltro,
      });
      setCobrancas(res.items);
      setTotal(res.total);
      setTotalPaginas(res.totalPaginas);
    } catch {
      // erro de rede ou 401 — já tratado pelo apiFetch (redirect login)
    } finally {
      setLoading(false);
    }
  }, [pagina, busca, statusFiltro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function handleBusca(v: string) {
    setBusca(v);
    setPagina(1);
  }

  function showToast(msg: string, tipo: "ok" | "err") {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleCriar(body: CriarCobrancaBody) {
    setFormLoading(true);
    setFormApiError(undefined);
    try {
      await criarCobranca(body);
      setModalAberto(false);
      setPagina(1);
      await carregar();
      showToast("Cobrança gerada com sucesso!", "ok");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err.mensagem);
      } else {
        showToast("Erro ao gerar cobrança.", "err");
      }
    } finally {
      setFormLoading(false);
    }
  }

  async function handleCancelar() {
    if (!confirmCancelar) return;
    setCancelLoading(true);
    try {
      await cancelarCobranca(confirmCancelar.id);
      setConfirmCancelar(null);
      await carregar();
      showToast("Cobrança cancelada.", "ok");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.mensagem : "Erro ao cancelar cobrança.",
        "err"
      );
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cobranças
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Acompanhe e gerencie as cobranças Pix do seu estabelecimento.
          </p>
        </div>
        <button
          onClick={() => { setFormApiError(undefined); setModalAberto(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} />
          Nova Cobrança
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={busca}
            onChange={(e) => handleBusca(e.target.value)}
            placeholder="Buscar por nome do membro..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-shadow"
          />
          {busca && (
            <button
              onClick={() => handleBusca("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={statusFiltro}
          onChange={(e) => {
            setStatusFiltro(e.target.value as StatusCobranca | "");
            setPagina(1);
          }}
          className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-shadow"
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                {["Membro", "Valor", "Vencimento", "Status", "Ações"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : cobrancas.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-gray-400 dark:text-slate-500"
                  >
                    {busca || statusFiltro
                      ? "Nenhuma cobrança encontrada com os filtros aplicados."
                      : "Nenhuma cobrança gerada ainda."}
                  </td>
                </tr>
              ) : (
                cobrancas.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {c.nomeMembro}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {formatBRL(c.valor)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                      {formatDate(c.dataVencimento)}
                    </td>
                    <td className="px-4 py-3">
                      <CobrancaStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ActionsMenu
                        cobranca={c}
                        onCancelar={setConfirmCancelar}
                      />
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

      {/* Modal Nova Cobrança */}
      <Modal
        isOpen={modalAberto}
        onClose={() => { setModalAberto(false); setFormApiError(undefined); }}
        className="max-w-md"
      >
        <CobrancaForm
          loading={formLoading}
          apiError={formApiError}
          onSubmit={handleCriar}
          onCancel={() => { setModalAberto(false); setFormApiError(undefined); }}
        />
      </Modal>

      {/* Cancel confirmation */}
      <CancelDialog
        cobranca={confirmCancelar}
        loading={cancelLoading}
        onConfirm={handleCancelar}
        onCancel={() => setConfirmCancelar(null)}
      />

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-[200] px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all",
            toast.tipo === "ok"
              ? "bg-emerald-600 dark:bg-emerald-500"
              : "bg-red-600 dark:bg-red-500"
          )}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
