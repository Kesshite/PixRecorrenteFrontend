import { apiFetch, apiFetchJson, ApiError } from "./client";
import type {
  Membro,
  StatusMembro,
  CriarMembroBody,
  AtualizarMembroBody,
  ListagemPaginadaDTO,
} from "@/types";

// ---- Divergência documentada (ver DUVIDAS.md) ----
// O backend retorna e aceita status como enum numérico:
//   1=Ativo, 2=Inadimplente, 3=Pausado, 4=Cancelado
// O CONTRATOS-API.md define string. Mapeamos na borda.

type StatusNumerico = 1 | 2 | 3 | 4;

const NUM_TO_STATUS: Record<StatusNumerico, StatusMembro> = {
  1: "Ativo",
  2: "Inadimplente",
  3: "Pausado",
  4: "Cancelado",
};

const STATUS_TO_NUM: Record<StatusMembro, StatusNumerico> = {
  Ativo: 1,
  Inadimplente: 2,
  Pausado: 3,
  Cancelado: 4,
};

interface MembroRaw extends Omit<Membro, "status"> {
  status: StatusMembro | StatusNumerico;
}

function normalizeStatus(raw: StatusMembro | StatusNumerico): StatusMembro {
  if (typeof raw === "number") {
    return NUM_TO_STATUS[raw as StatusNumerico] ?? "Ativo";
  }
  return raw;
}

function normalizeMembro(raw: MembroRaw): Membro {
  return { ...raw, status: normalizeStatus(raw.status) };
}

// ---- Params ----

export interface ListarMembrosParams {
  pagina?: number;
  porPagina?: number;
  busca?: string;
  status?: StatusMembro | "";
}

// ---- Endpoints ----

export async function listarMembros(
  params: ListarMembrosParams = {},
): Promise<ListagemPaginadaDTO<Membro>> {
  const { pagina = 1, porPagina = 10, busca, status } = params;
  const qs = new URLSearchParams();
  qs.set("pagina", String(pagina));
  qs.set("porPagina", String(porPagina));
  if (busca?.trim()) qs.set("busca", busca.trim());
  if (status) qs.set("status", status);

  const raw = await apiFetchJson<ListagemPaginadaDTO<MembroRaw>>(
    `/membros?${qs}`,
  );
  return { ...raw, items: raw.items.map(normalizeMembro) };
}

export async function criarMembro(body: CriarMembroBody): Promise<Membro> {
  const raw = await apiFetchJson<MembroRaw>("/membros", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return normalizeMembro(raw);
}

export async function atualizarMembro(
  id: string,
  body: AtualizarMembroBody,
): Promise<Membro> {
  const raw = await apiFetchJson<MembroRaw>(`/membros/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return normalizeMembro(raw);
}

export async function excluirMembro(id: string): Promise<void> {
  const res = await apiFetch(`/membros/${id}`, { method: "DELETE" });
  if (!res.ok) {
    try {
      const json = await res.json();
      if (Array.isArray(json.erros) && json.erros.length > 0) {
        throw new ApiError(json.erros[0].mensagem as string, res.status);
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }
    throw new ApiError(`Erro ${res.status}`, res.status);
  }
}

export async function alterarStatusMembro(
  id: string,
  novoStatus: StatusMembro,
): Promise<Membro> {
  const raw = await apiFetchJson<MembroRaw>(`/membros/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: STATUS_TO_NUM[novoStatus] }),
  });
  return normalizeMembro(raw);
}
