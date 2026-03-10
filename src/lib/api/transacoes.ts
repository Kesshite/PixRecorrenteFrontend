import { apiFetchJson } from "./client";
import type {
  Transacao,
  TipoTransacao,
  ResumoFinanceiro,
  ListagemPaginadaDTO,
} from "@/types";

// ---- Params ----

export interface ListarTransacoesParams {
  pagina?: number;
  porPagina?: number;
  tipo?: TipoTransacao | "";
  cobrancaId?: string;
  de?: string;
  ate?: string;
}

export interface ResumoParams {
  de?: string;
  ate?: string;
}

// ---- Endpoints ----

export async function listarTransacoes(
  params: ListarTransacoesParams = {},
): Promise<ListagemPaginadaDTO<Transacao>> {
  const { pagina = 1, porPagina = 10, tipo, cobrancaId, de, ate } = params;
  const qs = new URLSearchParams();
  qs.set("pagina", String(pagina));
  qs.set("porPagina", String(porPagina));
  if (tipo) qs.set("tipo", tipo);
  if (cobrancaId?.trim()) qs.set("cobrancaId", cobrancaId.trim());
  if (de) qs.set("de", de);
  if (ate) qs.set("ate", ate);

  return apiFetchJson<ListagemPaginadaDTO<Transacao>>(`/transacoes?${qs}`);
}

export async function obterResumo(
  params: ResumoParams = {},
): Promise<ResumoFinanceiro> {
  const qs = new URLSearchParams();
  if (params.de) qs.set("de", params.de);
  if (params.ate) qs.set("ate", params.ate);
  const query = qs.toString();
  return apiFetchJson<ResumoFinanceiro>(`/transacoes/resumo${query ? `?${query}` : ""}`);
}
