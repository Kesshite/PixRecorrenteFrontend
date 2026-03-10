export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureData {
  iconName: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface StepData {
  number: number;
  iconName: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface SignupFormData {
  nome: string;
  whatsapp: string;
  estabelecimento: string;
  segmento: "" | "academia" | "estudio" | "escola" | "outro";
}

// ---------- Membros ----------

export type StatusMembro = "Ativo" | "Pausado" | "Cancelado" | "Inadimplente";

export interface Membro {
  id: string;
  estabelecimentoId: string;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  nomePlano: string | null;
  valorMensal: number;
  diaVencimento: number;
  status: StatusMembro;
  tags: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ListagemPaginadaDTO<T> {
  items: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface CriarMembroBody {
  nome: string;
  cpf?: string | null;
  telefone?: string | null;
  email?: string | null;
  nomePlano?: string | null;
  valorMensal: number;
  diaVencimento: number;
  tags?: string | null;
}

export type AtualizarMembroBody = CriarMembroBody;

// ---------- Cobranças ----------

export type StatusCobranca = "Pendente" | "Paga" | "Vencida" | "Cancelada";

export interface Cobranca {
  id: string;
  estabelecimentoId: string;
  membroId: string;
  nomeMembro: string;
  valor: number;
  dataVencimento: string;
  status: StatusCobranca;
  provedorPsp?: string;
  idCobrancaPsp?: string;
  brcode?: string;
  qrcodeUrl?: string;
  linkPagamento?: string;
  pagoEm?: string;
  valorPago?: number;
  statusNotificacao?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarCobrancaBody {
  membroId: string;
  valor?: number;
  dataVencimento?: string;
}

// ---------- Transações ----------

export type TipoTransacao = "Credito" | "Estorno";

export interface Transacao {
  id: string;
  estabelecimentoId: string;
  cobrancaId: string;
  nomeMembro: string;
  valor: number;
  tipo: TipoTransacao;
  idTransacaoPsp: string | null;
  criadoEm: string;
}

export interface ResumoFinanceiro {
  totalRecebido: number;
  totalEstornos: number;
  saldo: number;
  quantidadeTransacoes: number;
  periodoInicio: string;
  periodoFim: string;
}

// ---------- Estabelecimento ----------

export interface Estabelecimento {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string | null;
  chavePix: string | null;
  plano: string | null;
  status: string | null;
  logotipo: string | null;
  regraCobranca: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AtualizarEstabelecimentoBody {
  nome: string;
  documento: string;
  telefone: string | null;
  chavePix: string | null;
  logotipo: string | null;
}
