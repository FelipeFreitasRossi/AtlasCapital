// Serviço de autenticação. Assim como o stockService, ele SIMULA uma
// API: guarda os usuários cadastrados e a sessão atual dentro do
// localStorage do navegador. Nada disso é seguro o suficiente para
// produção (a "senha" fica em texto puro) — é só o bastante para o
// frontend funcionar de ponta a ponta enquanto o backend de auth não
// existe. Quando o backend estiver pronto, troque o CORPO de cada
// função pelas chamadas "fetch" comentadas logo abaixo dela; a
// ASSINATURA (o que cada função recebe/devolve) não precisa mudar.

import type { LoginInput, RegisterInput, User } from "../types/auth";
import { AuthError } from "../types/auth";
// NODE_API_URL (definida em "./apiConfig") é o endereço base que será
// usado nos comentários de exemplo abaixo, quando o backend de
// autenticação estiver pronto.

const USERS_KEY = "atlascapital:users";
const SESSION_KEY = "atlascapital:session";

interface StoredUser extends User {
  password: string;
}

function fakeNetworkDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}

function toPublicUser(user: StoredUser): User {
  return { id: user.id, name: user.name, email: user.email };
}

// ------------------------------------------------------------------
// register: cria um novo usuário, verificando se o e-mail já existe.
// ------------------------------------------------------------------
export async function register(input: RegisterInput): Promise<User> {
  await fakeNetworkDelay();

  const email = input.email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((user) => user.email === email)) {
    throw new AuthError("Este e-mail já está cadastrado.");
  }

  const newUser: StoredUser = {
    id: generateId(),
    name: input.name.trim(),
    email,
    password: input.password,
  };

  writeUsers([...users, newUser]);
  const publicUser = toPublicUser(newUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;

  // Quando o backend (Node/FastAPI) tiver autenticação, troque o
  // trecho acima por algo como:
  //
  // const response = await fetch(`${NODE_API_URL}/auth/register`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(input),
  // });
  // if (!response.ok) {
  //   const body = await response.json().catch(() => null);
  //   throw new AuthError(body?.message ?? "Não foi possível criar a conta.");
  // }
  // const { user, token } = await response.json();
  // localStorage.setItem("atlascapital:token", token);
  // return user;
}

// ------------------------------------------------------------------
// login: confere e-mail/senha contra os usuários cadastrados.
// ------------------------------------------------------------------
export async function login(input: LoginInput): Promise<User> {
  await fakeNetworkDelay();

  const email = input.email.trim().toLowerCase();
  const users = readUsers();
  const found = users.find((user) => user.email === email);

  if (!found || found.password !== input.password) {
    throw new AuthError("E-mail ou senha inválidos.");
  }

  const publicUser = toPublicUser(found);
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;

  // Versão com API real:
  //
  // const response = await fetch(`${NODE_API_URL}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(input),
  // });
  // if (!response.ok) throw new AuthError("E-mail ou senha inválidos.");
  // const { user, token } = await response.json();
  // localStorage.setItem("atlascapital:token", token);
  // return user;
}

// ------------------------------------------------------------------
// logout: apenas apaga a sessão local.
// ------------------------------------------------------------------
export async function logout(): Promise<void> {
  await fakeNetworkDelay(150);
  localStorage.removeItem(SESSION_KEY);
}

// ------------------------------------------------------------------
// getCurrentUser: lê o usuário logado (se houver) do localStorage.
// Usado para restaurar a sessão quando o usuário recarrega a página.
// ------------------------------------------------------------------
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
