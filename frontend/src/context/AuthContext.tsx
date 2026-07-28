// frontend/src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { User, LoginInput, RegisterInput } from "../types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  hasSeenOnboarding: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  markOnboardingAsSeen: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const checkOnboardingStatus = (userId: string) => {
    const key = `atlascapital:onboarding_seen:${userId}`;
    setHasSeenOnboarding(localStorage.getItem(key) === "true");
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          checkOnboardingStatus(currentUser.id);
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };
    loadSession();
  }, []);

  const login = async (data: LoginInput) => {
    const loggedUser = await authService.login(data);
    setUser(loggedUser);
    checkOnboardingStatus(loggedUser.id);
  };

  const register = async (data: RegisterInput) => {
    const newUser = await authService.register(data);
    setUser(newUser);
    checkOnboardingStatus(newUser.id);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setHasSeenOnboarding(false);
  };

  const markOnboardingAsSeen = () => {
    if (user?.id) {
      localStorage.setItem(`atlascapital:onboarding_seen:${user.id}`, "true");
      setHasSeenOnboarding(true);
    } else {
      localStorage.setItem("atlascapital:onboarding_seen", "true");
      setHasSeenOnboarding(true);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isCheckingSession,
    hasSeenOnboarding,
    login,
    register,
    logout,
    markOnboardingAsSeen,
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