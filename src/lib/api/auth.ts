import { ApiError, NetworkError } from "./client";

const BASE_URL = "http://localhost:5000/api";

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

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const json = await res.json();
    if (Array.isArray(json.erros) && json.erros.length > 0) {
      return json.erros[0].mensagem as string;
    }
  } catch {
    // corpo não é JSON
  }
  return `Erro ${res.status}`;
}

/**
 * POST /api/auth/login
 * Autentica com email e senha. Retorna access token + refresh token.
 */
export async function login(body: LoginBody): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new NetworkError();
  }

  if (!res.ok) {
    const mensagem = await extractErrorMessage(res);
    throw new ApiError(mensagem, res.status);
  }

  return res.json() as Promise<AuthResponse>;
}

/**
 * POST /api/auth/registro
 * Cria uma nova conta de estabelecimento.
 */
export async function registro(body: RegistroBody): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new NetworkError();
  }

  if (!res.ok) {
    const mensagem = await extractErrorMessage(res);
    throw new ApiError(mensagem, res.status);
  }

  return res.json() as Promise<AuthResponse>;
}

/**
 * POST /api/auth/refresh
 * Troca um refresh token por novos tokens. Lança ApiError se inválido/expirado.
 */
export async function refresh(refreshToken: string): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    throw new NetworkError();
  }

  if (!res.ok) {
    const mensagem = await extractErrorMessage(res);
    throw new ApiError(mensagem, res.status);
  }

  return res.json() as Promise<AuthResponse>;
}

/**
 * POST /api/auth/logout
 * Invalida o refresh token (melhor esforço — falha silenciosamente).
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    // logout best-effort — não bloquear a UI
  }
}
