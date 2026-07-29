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
    const loadUser = async () => {
      console.log("[AuthContext] Iniciando verificação de sessão...");
      try {
        const currentUser = await authService.getCurrentUser();
        console.log("[AuthContext] Usuário carregado:", currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error("[AuthContext] Erro ao carregar usuário:", error);
        setUser(null);
      } finally {
        console.log("[AuthContext] Verificação concluída. Autenticado:", !!user);
        setIsCheckingSession(false);
      }
    };
    loadUser();
  }, []);

  const login = async (data: LoginInput) => {
    const loggedUser = await authService.login(data);
    console.log("[AuthContext] Login bem-sucedido:", loggedUser);
    setUser(loggedUser);
  };

  const register = async (data: RegisterInput) => {
    const newUser = await authService.register(data);
    console.log("[AuthContext] Registro bem-sucedido:", newUser);
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

  console.log("[AuthContext] Estado atual:", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}