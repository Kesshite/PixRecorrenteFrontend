"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  login as apiLogin,
  registro as apiRegistro,
  logout as apiLogout,
  type LoginBody,
  type RegistroBody,
  type AuthResponse,
} from "@/lib/api/auth";
import { setTokenHandlers } from "@/lib/api/client";

interface AuthUser {
  nome: string;
  email: string;
  estabelecimentoId: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (body: LoginBody) => Promise<void>;
  registro: (body: RegistroBody) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "pixrecorrente_auth";

interface StoredAuth {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  });

  // Ref para leitura síncrona dos tokens pelos handlers do client
  const stateRef = useRef(state);
  stateRef.current = state;

  // Hidratar do localStorage no mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredAuth = JSON.parse(raw);
        setState({
          user: stored.user,
          token: stored.token,
          refreshToken: stored.refreshToken,
          isAuthenticated: true,
        });
      }
    } catch {
      // localStorage corrompido — limpar
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Registrar handlers no client HTTP para injeção de token e auto-refresh (Sub-task 6b)
  useEffect(() => {
    setTokenHandlers({
      getAccessToken: () => stateRef.current.token,
      getRefreshToken: () => stateRef.current.refreshToken,
      onNewTokens: (res: AuthResponse) => {
        const user: AuthUser = {
          nome: res.estabelecimento.nome,
          email: res.estabelecimento.email,
          estabelecimentoId: res.estabelecimento.id,
        };
        persist({ user, token: res.accessToken, refreshToken: res.refreshToken });
        setState({
          user,
          token: res.accessToken,
          refreshToken: res.refreshToken,
          isAuthenticated: true,
        });
      },
      onAuthExpired: () => {
        // Token expirado e refresh falhou — limpar sessão
        // O DashboardLayout detecta !isAuthenticated e redireciona para /login
        clear();
        setState({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
    });
  }, []); // handlers são estáveis (leem via ref)

  const persist = (data: StoredAuth) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (body: LoginBody) => {
    const res = await apiLogin(body);
    const user: AuthUser = {
      nome: res.estabelecimento.nome,
      email: res.estabelecimento.email,
      estabelecimentoId: res.estabelecimento.id,
    };
    persist({ user, token: res.accessToken, refreshToken: res.refreshToken });
    setState({
      user,
      token: res.accessToken,
      refreshToken: res.refreshToken,
      isAuthenticated: true,
    });
  }, []);

  const registro = useCallback(async (body: RegistroBody) => {
    const res = await apiRegistro(body);
    const user: AuthUser = {
      nome: res.estabelecimento.nome,
      email: res.estabelecimento.email,
      estabelecimentoId: res.estabelecimento.id,
    };
    persist({ user, token: res.accessToken, refreshToken: res.refreshToken });
    setState({
      user,
      token: res.accessToken,
      refreshToken: res.refreshToken,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(async () => {
    if (stateRef.current.refreshToken) {
      await apiLogout(stateRef.current.refreshToken).catch(() => {
        // falha silenciosa — limpar local de qualquer forma
      });
    }
    clear();
    setState({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
