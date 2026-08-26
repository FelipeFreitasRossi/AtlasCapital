// frontend/src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { User, LoginInput, RegisterInput } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          console.log('[AuthContext] Usuário carregado:', currentUser);
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao carregar usuário:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
          console.log('[AuthContext] Verificação concluída. Autenticado:', !!user);
        }
      }
    };

    // Fallback de segurança: se depois de 5 segundos ainda estiver checando, força finalização
    const timeout = setTimeout(() => {
      if (isMounted && isCheckingSession) {
        console.warn('[AuthContext] Fallback: forçando fim da verificação após 5s');
        setIsCheckingSession(false);
      }
    }, 5000);

    loadUser();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const login = async (data: LoginInput) => {
    const loggedUser = await authService.login(data);
    setUser(loggedUser);
  };

  const register = async (data: RegisterInput) => {
    const newUser = await authService.register(data);
    setUser(newUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isCheckingSession,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}