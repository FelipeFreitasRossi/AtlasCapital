// frontend/src/services/authService.ts

import type { User, LoginInput, RegisterInput } from "../types/auth";

const SESSION_KEY = "atlascapital:session";
const USERS_KEY = "atlascapital:users";

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  async login(data: LoginInput): Promise<User> {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find((u: any) => u.email === data.email && u.password === data.password);
    if (!found) {
      throw new Error("E-mail ou senha inválidos.");
    }
    const user = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async register(data: RegisterInput): Promise<User> {
    await delay(500);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (users.some((u: any) => u.email === data.email)) {
      throw new Error("Este e-mail já está cadastrado.");
    }
    const newUser = {
      id: String(users.length + 1),
      name: data.name,
      email: data.email,
      password: data.password,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const user = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },
};