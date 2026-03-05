import type {
  Membro,
  StatusMembro,
  CriarMembroBody,
  AtualizarMembroBody,
  ListagemPaginadaDTO,
} from "@/types";
import { membrosIniciais } from "@/data/membros";

// In-memory store — substituir por fetch real na Task 6a
let store: Membro[] = [...membrosIniciais];

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const TRANSICOES: Record<StatusMembro, StatusMembro[]> = {
  Ativo: ["Pausado", "Cancelado", "Inadimplente"],
  Pausado: ["Ativo", "Cancelado"],
  Inadimplente: ["Ativo", "Cancelado"],
  Cancelado: [],
};

export interface ListarParams {
  pagina?: number;
  porPagina?: number;
  busca?: string;
  status?: StatusMembro | "";
}

export const membrosService = {
  async listar(
    params: ListarParams = {}
  ): Promise<ListagemPaginadaDTO<Membro>> {
    await delay();
    const { pagina = 1, porPagina = 10, busca, status } = params;

    let filtered = store;

    if (busca && busca.trim()) {
      const q = busca.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nome.toLowerCase().includes(q) ||
          (m.cpf ?? "").includes(q) ||
          (m.email ?? "").toLowerCase().includes(q)
      );
    }

    if (status) {
      filtered = filtered.filter((m) => m.status === status);
    }

    const total = filtered.length;
    const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
    const start = (pagina - 1) * porPagina;
    const items = filtered.slice(start, start + porPagina);

    return { items, total, pagina, porPagina, totalPaginas };
  },

  async criar(body: CriarMembroBody): Promise<Membro> {
    await delay();
    const now = new Date().toISOString();
    const membro: Membro = {
      id: crypto.randomUUID(),
      estabelecimentoId: "est-mock-001",
      nome: body.nome,
      cpf: body.cpf ?? null,
      telefone: body.telefone ?? null,
      email: body.email ?? null,
      nomePlano: body.nomePlano ?? null,
      valorMensal: body.valorMensal,
      diaVencimento: body.diaVencimento,
      status: "Ativo",
      tags: body.tags ?? null,
      criadoEm: now,
      atualizadoEm: now,
    };
    store = [membro, ...store];
    return membro;
  },

  async atualizar(id: string, body: AtualizarMembroBody): Promise<Membro> {
    await delay();
    const idx = store.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Membro não encontrado");
    const updated: Membro = {
      ...store[idx],
      nome: body.nome,
      cpf: body.cpf ?? null,
      telefone: body.telefone ?? null,
      email: body.email ?? null,
      nomePlano: body.nomePlano ?? null,
      valorMensal: body.valorMensal,
      diaVencimento: body.diaVencimento,
      tags: body.tags ?? null,
      atualizadoEm: new Date().toISOString(),
    };
    store = store.map((m, i) => (i === idx ? updated : m));
    return updated;
  },

  async excluir(id: string): Promise<void> {
    await delay();
    store = store.filter((m) => m.id !== id);
  },

  async alterarStatus(id: string, novoStatus: StatusMembro): Promise<Membro> {
    await delay();
    const idx = store.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error("Membro não encontrado");
    const membro = store[idx];
    if (!TRANSICOES[membro.status].includes(novoStatus)) {
      throw new Error(
        `Transição inválida: ${membro.status} → ${novoStatus}`
      );
    }
    const updated: Membro = {
      ...membro,
      status: novoStatus,
      atualizadoEm: new Date().toISOString(),
    };
    store = store.map((m, i) => (i === idx ? updated : m));
    return updated;
  },
};

export { TRANSICOES };
