import { apiFetchJson } from "./client";
import type {
  Cobranca,
  StatusCobranca,
  CriarCobrancaBody,
  ListagemPaginadaDTO,
} from "@/types";

// ---- Params ----

export interface ListarCobrancasParams {
  pagina?: number;
  porPagina?: number;
  busca?: string;
  status?: StatusCobranca | "";
  membroId?: string;
}

// ---- Endpoints ----

export async function listarCobrancas(
  params: ListarCobrancasParams = {},
): Promise<ListagemPaginadaDTO<Cobranca>> {
  const { pagina = 1, porPagina = 10, busca, status, membroId } = params;
  const qs = new URLSearchParams();
  qs.set("pagina", String(pagina));
  qs.set("porPagina", String(porPagina));
  if (busca?.trim()) qs.set("busca", busca.trim());
  if (status) qs.set("status", status);
  if (membroId?.trim()) qs.set("membroId", membroId.trim());

  return apiFetchJson<ListagemPaginadaDTO<Cobranca>>(`/cobrancas?${qs}`);
}

export async function criarCobranca(body: CriarCobrancaBody): Promise<Cobranca> {
  return apiFetchJson<Cobranca>("/cobrancas", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function cancelarCobranca(id: string): Promise<Cobranca> {
  return apiFetchJson<Cobranca>(`/cobrancas/${id}/cancelar`, {
    method: "PATCH",
  });
}
