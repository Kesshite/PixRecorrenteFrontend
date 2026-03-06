import { apiFetch, apiFetchJson, ApiError } from "./client";
import type {
  Membro,
  StatusMembro,
  CriarMembroBody,
  AtualizarMembroBody,
  ListagemPaginadaDTO,
} from "@/types";

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

  return apiFetchJson<ListagemPaginadaDTO<Membro>>(`/membros?${qs}`);
}

export async function criarMembro(body: CriarMembroBody): Promise<Membro> {
  return apiFetchJson<Membro>("/membros", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function atualizarMembro(
  id: string,
  body: AtualizarMembroBody,
): Promise<Membro> {
  return apiFetchJson<Membro>(`/membros/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
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
  return apiFetchJson<Membro>(`/membros/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: novoStatus }),
  });
}
