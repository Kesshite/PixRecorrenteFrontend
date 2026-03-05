"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  login as apiLogin,
  registro as apiRegistro,
  logout as apiLogout,
  type LoginBody,
  type RegistroBody,
} from "@/lib/api/auth";

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
    if (state.refreshToken) {
      await apiLogout(state.refreshToken).catch(() => {
        // falha silenciosa — limpar local de qualquer forma
      });
    }
    clear();
    setState({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  }, [state.refreshToken]);

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
