import { apiFetchJson } from "./client";
import type { Estabelecimento, AtualizarEstabelecimentoBody } from "@/types";

export async function obterEstabelecimento(): Promise<Estabelecimento> {
  return apiFetchJson<Estabelecimento>("/estabelecimento");
}

export async function atualizarEstabelecimento(
  body: AtualizarEstabelecimentoBody,
): Promise<Estabelecimento> {
  return apiFetchJson<Estabelecimento>("/estabelecimento", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
