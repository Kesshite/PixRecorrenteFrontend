import type { AuthResponse } from "./auth";

const BASE_URL = "http://localhost:5000/api";

// ---- Tipos de erro ----

export class ApiError extends Error {
  constructor(
    public readonly mensagem: string,
    public readonly status: number,
  ) {
    super(mensagem);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor() {
    super("Servidor indisponível. Verifique sua conexão.");
    this.name = "NetworkError";
  }
}

// ---- Token handlers injetados pelo AuthContext ----

type TokenHandlers = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onNewTokens: (res: AuthResponse) => void;
  onAuthExpired: () => void;
};

let _handlers: TokenHandlers | null = null;

export function setTokenHandlers(h: TokenHandlers): void {
  _handlers = h;
}

// ---- Extrai mensagem de erro do formato { erros: [{ mensagem }] } ----

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

// ---- Cliente HTTP principal com interceptor de 401 ----

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const accessToken = _handlers?.getAccessToken() ?? null;

  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // Mescla headers do caller (se houver), sem sobrescrever Content-Type
  const merged: Record<string, string> = {
    ...baseHeaders,
    ...(init?.headers as Record<string, string> | undefined),
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers: merged });
  } catch {
    throw new NetworkError();
  }

  // Se 401 e temos handlers, tentamos refresh automático
  if (res.status === 401 && _handlers) {
    const refreshToken = _handlers.getRefreshToken();

    if (!refreshToken) {
      _handlers.onAuthExpired();
      throw new ApiError("Sessão expirada. Faça login novamente.", 401);
    }

    let refreshRes: Response;
    try {
      refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      _handlers.onAuthExpired();
      throw new NetworkError();
    }

    if (!refreshRes.ok) {
      _handlers.onAuthExpired();
      throw new ApiError("Sessão expirada. Faça login novamente.", 401);
    }

    const newTokens: AuthResponse = await refreshRes.json();
    _handlers.onNewTokens(newTokens);

    // Retry da request original com o novo accessToken
    const retryHeaders: Record<string, string> = {
      ...merged,
      Authorization: `Bearer ${newTokens.accessToken}`,
    };
    try {
      return fetch(`${BASE_URL}${path}`, { ...init, headers: retryHeaders });
    } catch {
      throw new NetworkError();
    }
  }

  return res;
}

/**
 * Helper: apiFetch + lança ApiError se response não for ok.
 * Use para endpoints que retornam JSON na resposta.
 */
export async function apiFetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    const mensagem = await extractErrorMessage(res);
    throw new ApiError(mensagem, res.status);
  }
  return res.json() as Promise<T>;
}
