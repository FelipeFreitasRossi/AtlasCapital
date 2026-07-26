// Formato dos dados de usuário e autenticação usados pelo app.
// Hoje tudo é simulado com localStorage (veja authService.ts), mas os
// formatos abaixo já são pensados para bater com o que uma API real
// (Node.js ou FastAPI) devolveria, facilitando a troca no futuro.

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Erro "de negócio" lançado pelo authService (ex: e-mail já cadastrado,
// credenciais inválidas). Usamos uma classe própria para poder
// distinguir esses erros de falhas inesperadas, se precisar.
export class AuthError extends Error {}
