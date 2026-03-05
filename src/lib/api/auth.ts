// TODO: integrar com API real — Base URL: http://localhost:5000/api

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiraEm: string;
  estabelecimento: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface LoginBody {
  email: string;
  senha: string;
}

export interface RegistroBody {
  email: string;
  senha: string;
  nomeEstabelecimento: string;
  documento?: string;
}

export interface ApiError {
  erros: { codigoHttp: number; mensagem: string }[];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/auth/login
 * Mock: simula autenticação com delay de 500ms.
 * TODO: integrar com API real
 */
export async function login(body: LoginBody): Promise<AuthResponse> {
  await delay(500);

  // Mock simples — qualquer email/senha válidos retornam sucesso
  return {
    accessToken: "mock-access-token-" + Date.now(),
    refreshToken: "mock-refresh-token-" + Date.now(),
    expiraEm: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    estabelecimento: {
      id: "mock-estabelecimento-uuid",
      nome: body.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " "),
      email: body.email,
    },
  };
}

/**
 * POST /api/auth/registro
 * Mock: simula criação de conta com delay de 500ms.
 * TODO: integrar com API real
 */
export async function registro(body: RegistroBody): Promise<AuthResponse> {
  await delay(500);

  return {
    accessToken: "mock-access-token-" + Date.now(),
    refreshToken: "mock-refresh-token-" + Date.now(),
    expiraEm: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    estabelecimento: {
      id: "mock-estabelecimento-uuid",
      nome: body.nomeEstabelecimento,
      email: body.email,
    },
  };
}

/**
 * POST /api/auth/logout
 * TODO: integrar com API real
 */
export async function logout(refreshToken: string): Promise<void> {
  await delay(200);
  // TODO: chamar POST /api/auth/logout com { refreshToken }
  void refreshToken;
}
