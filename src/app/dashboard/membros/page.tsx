"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/badge";
import {
  listarMembros,
  criarMembro,
  atualizarMembro,
  excluirMembro,
  alterarStatusMembro,
} from "@/lib/api/membros";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Membro, StatusMembro, CriarMembroBody } from "@/types";

const TRANSICOES: Record<StatusMembro, StatusMembro[]> = {
  Ativo: ["Pausado", "Cancelado", "Inadimplente"],
  Pausado: ["Ativo", "Cancelado"],
  Inadimplente: ["Ativo", "Cancelado"],
  Cancelado: [],
};

// ---------- Helpers ----------

const STATUS_OPTIONS: StatusMembro[] = [
  "Ativo",
  "Pausado",
  "Inadimplente",
  "Cancelado",
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ---------- Form ----------

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

function emptyForm(): FormState {
  return {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    nomePlano: "",
    valorMensal: "",
    diaVencimento: "",
    tags: "",
  };
}

function fromMembro(m: Membro): FormState {
  return {
    nome: m.nome,
    cpf: m.cpf ?? "",
    telefone: m.telefone ?? "",
    email: m.email ?? "",
    nomePlano: m.nomePlano ?? "",
    valorMensal: String(m.valorMensal),
    diaVencimento: String(m.diaVencimento),
    tags: m.tags ?? "",
  };
}

function toBody(form: FormState): CriarMembroBody {
  return {
    nome: form.nome.trim(),
    cpf: form.cpf.trim() || null,
    telefone: form.telefone.trim() || null,
    email: form.email.trim() || null,
    nomePlano: form.nomePlano.trim() || null,
    valorMensal: parseFloat(form.valorMensal),
    diaVencimento: parseInt(form.diaVencimento, 10),
    tags: form.tags.trim() || null,
  };
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.nome.trim()) errors.nome = "Nome é obrigatório";
  const valor = parseFloat(form.valorMensal);
  if (!form.valorMensal || isNaN(valor) || valor <= 0)
    errors.valorMensal = "Informe um valor maior que zero";
  const dia = parseInt(form.diaVencimento, 10);
  if (!form.diaVencimento || isNaN(dia) || dia < 1 || dia > 28)
    errors.diaVencimento = "Dia deve ser entre 1 e 28";
  return errors;
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
  max,
  step,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-shadow"
    />
  );
}

// ---------- MembroForm ----------

interface MembroFormProps {
  initial: FormState;
  loading: boolean;
  title: string;
  apiError?: string;
  onSubmit: (body: CriarMembroBody) => void;
  onCancel: () => void;
}

function MembroForm({
  initial,
  loading,
  title,
  apiError,
  onSubmit,
  onCancel,
}: MembroFormProps) {
  const [form, setForm] = useState<FormState>(initial);
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
        {title}
      </h2>

      <Field label="Nome *" error={errors.nome}>
        <TextInput
          value={form.nome}
          onChange={(v) => set("nome", v)}
          placeholder="Nome completo"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="CPF">
          <TextInput
            value={form.cpf}
            onChange={(v) => set("cpf", v)}
            placeholder="000.000.000-00"
          />
        </Field>
        <Field label="Telefone">
          <TextInput
            value={form.telefone}
            onChange={(v) => set("telefone", v)}
            placeholder="(11) 99999-9999"
          />
        </Field>
      </div>

      <Field label="Email">
        <TextInput
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          placeholder="email@exemplo.com"
        />
      </Field>

      <Field label="Plano / Modalidade">
        <TextInput
          value={form.nomePlano}
          onChange={(v) => set("nomePlano", v)}
          placeholder="Ex: Musculação, Natação"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Valor Mensal (R$) *" error={errors.valorMensal}>
          <TextInput
            type="number"
            min="0.01"
            step="0.01"
            value={form.valorMensal}
            onChange={(v) => set("valorMensal", v)}
            placeholder="129,90"
          />
        </Field>
        <Field label="Dia Vencimento *" error={errors.diaVencimento}>
          <TextInput
            type="number"
            min="1"
            max="28"
            value={form.diaVencimento}
            onChange={(v) => set("diaVencimento", v)}
            placeholder="1–28"
          />
        </Field>
      </div>

      <Field label="Tags">
        <TextInput
          value={form.tags}
          onChange={(v) => set("tags", v)}
          placeholder="vip, mensal, personal"
        />
      </Field>

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
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

// ---------- DeleteDialog ----------

function DeleteDialog({
  membro,
  loading,
  onConfirm,
  onCancel,
}: {
  membro: Membro | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal isOpen={!!membro} onClose={onCancel}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Excluir membro
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
          Tem certeza que deseja excluir{" "}
          <strong className="text-gray-800 dark:text-white font-semibold">
            {membro?.nome}
          </strong>
          ? Essa ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------- StatusDropdown ----------

function StatusDropdown({
  membro,
  onAlterarStatus,
}: {
  membro: Membro;
  onAlterarStatus: (id: string, status: StatusMembro) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const opcoes = TRANSICOES[membro.status];

  function handleOpen() {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setOpen(true);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleScroll() { setOpen(false); }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  if (opcoes.length === 0) {
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
        title="Alterar status"
      >
        <MoreVertical size={16} />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: pos.top, right: pos.right }}
          className="z-[9999] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg min-w-[180px] py-1"
        >
          <p className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">
            Alterar para
          </p>
          {opcoes.map((status) => (
            <button
              key={status}
              onClick={() => {
                onAlterarStatus(membro.id, status);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <StatusBadge status={status} />
            </button>
          ))}
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
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ---------- Main Page ----------

type ModalMode = "criar" | "editar" | null;

export default function MembrosPage() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<StatusMembro | "">("");
  const [loading, setLoading] = useState(true);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [membroEditando, setMembroEditando] = useState<Membro | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formApiError, setFormApiError] = useState<string | undefined>(undefined);

  const [confirmExcluir, setConfirmExcluir] = useState<Membro | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);

  const POR_PAGINA = 10;

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listarMembros({
        pagina,
        porPagina: POR_PAGINA,
        busca,
        status: statusFiltro,
      });
      setMembros(res.items);
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

  // Debounce busca — resetar para pag 1
  const buscaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleBusca(v: string) {
    setBusca(v);
    setPagina(1);
    if (buscaTimer.current) clearTimeout(buscaTimer.current);
  }

  function showToast(msg: string, tipo: "ok" | "err") {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  }

  // Criar
  async function handleCriar(body: CriarMembroBody) {
    setFormLoading(true);
    setFormApiError(undefined);
    try {
      await criarMembro(body);
      setModalMode(null);
      setPagina(1);
      await carregar();
      showToast("Membro cadastrado com sucesso!", "ok");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err.mensagem);
      } else {
        showToast("Erro ao cadastrar membro.", "err");
      }
    } finally {
      setFormLoading(false);
    }
  }

  // Editar
  async function handleEditar(body: CriarMembroBody) {
    if (!membroEditando) return;
    setFormLoading(true);
    setFormApiError(undefined);
    try {
      await atualizarMembro(membroEditando.id, body);
      setModalMode(null);
      setMembroEditando(null);
      await carregar();
      showToast("Membro atualizado com sucesso!", "ok");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err.mensagem);
      } else {
        showToast("Erro ao atualizar membro.", "err");
      }
    } finally {
      setFormLoading(false);
    }
  }

  // Excluir
  async function handleExcluir() {
    if (!confirmExcluir) return;
    setDeleteLoading(true);
    try {
      await excluirMembro(confirmExcluir.id);
      setConfirmExcluir(null);
      if (membros.length === 1 && pagina > 1) setPagina((p) => p - 1);
      else await carregar();
      showToast("Membro excluído.", "ok");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.mensagem : "Erro ao excluir membro.",
        "err"
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  // Alterar status
  async function handleAlterarStatus(id: string, novoStatus: StatusMembro) {
    try {
      await alterarStatusMembro(id, novoStatus);
      await carregar();
      showToast(`Status alterado para ${novoStatus}.`, "ok");
    } catch (err) {
      showToast(
        err instanceof ApiError
          ? err.mensagem
          : err instanceof Error
            ? err.message
            : "Erro ao alterar status.",
        "err"
      );
    }
  }

  function abrirEditar(m: Membro) {
    setFormApiError(undefined);
    setMembroEditando(m);
    setModalMode("editar");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Membros
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Gerencie os membros do seu estabelecimento.
          </p>
        </div>
        <button
          onClick={() => setModalMode("criar")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} />
          Novo Membro
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
            placeholder="Buscar por nome, CPF ou email..."
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
            setStatusFiltro(e.target.value as StatusMembro | "");
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
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                {[
                  "Nome",
                  "CPF",
                  "Plano",
                  "Valor Mensal",
                  "Vencimento",
                  "Status",
                  "Ações",
                ].map((col) => (
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
              ) : membros.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-gray-400 dark:text-slate-500"
                  >
                    {busca || statusFiltro
                      ? "Nenhum membro encontrado com os filtros aplicados."
                      : "Nenhum membro cadastrado ainda."}
                  </td>
                </tr>
              ) : (
                membros.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {m.nome}
                        </p>
                        {m.email && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                            {m.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                      {m.cpf ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                      {m.nomePlano ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {formatBRL(m.valorMensal)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-400">
                      Dia {m.diaVencimento}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => abrirEditar(m)}
                          className="p-1.5 rounded-md text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmExcluir(m)}
                          className="p-1.5 rounded-md text-gray-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
                        </button>
                        <StatusDropdown
                          membro={m}
                          onAlterarStatus={handleAlterarStatus}
                        />
                      </div>
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

      {/* Modal Criar */}
      <Modal
        isOpen={modalMode === "criar"}
        onClose={() => { setModalMode(null); setFormApiError(undefined); }}
        className="max-w-lg"
      >
        <MembroForm
          initial={emptyForm()}
          loading={formLoading}
          title="Novo Membro"
          apiError={formApiError}
          onSubmit={handleCriar}
          onCancel={() => { setModalMode(null); setFormApiError(undefined); }}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={modalMode === "editar"}
        onClose={() => {
          setModalMode(null);
          setMembroEditando(null);
          setFormApiError(undefined);
        }}
        className="max-w-lg"
      >
        {membroEditando && (
          <MembroForm
            initial={fromMembro(membroEditando)}
            loading={formLoading}
            title="Editar Membro"
            apiError={formApiError}
            onSubmit={handleEditar}
            onCancel={() => {
              setModalMode(null);
              setMembroEditando(null);
              setFormApiError(undefined);
            }}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <DeleteDialog
        membro={confirmExcluir}
        loading={deleteLoading}
        onConfirm={handleExcluir}
        onCancel={() => setConfirmExcluir(null)}
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
