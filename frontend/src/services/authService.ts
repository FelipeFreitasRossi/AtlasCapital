// frontend/src/services/authService.ts

import { API_BASE_URL } from './apiConfig';
import type { User, LoginInput, RegisterInput } from '../types/auth';

const SESSION_KEY = 'atlascapital:session';
const TOKEN_KEY = 'atlascapital:token';

export const authService = {
  async login(data: LoginInput): Promise<User> {
    console.log('[authService] Tentando login com:', data.email);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login.');
    }
    const result = await response.json();
    console.log('[authService] Login response:', result);

    // 👇 SALVA O TOKEN E SESSÃO
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));

    console.log('[authService] Token salvo:', localStorage.getItem(TOKEN_KEY));
    return result.user;
  },

  async register(data: RegisterInput): Promise<User> {
    console.log('[authService] Tentando registrar:', data.email);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar conta.');
    }
    const result = await response.json();
    console.log('[authService] Register response:', result);

    // 👇 SALVA O TOKEN E SESSÃO (já loga automaticamente)
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));

    console.log('[authService] Token salvo:', localStorage.getItem(TOKEN_KEY));
    return result.user;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('[authService] Token recuperado:', token);
    if (!token) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      const user = await response.json();
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};