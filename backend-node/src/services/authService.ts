// backend-node/src/services/authService.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeychangeinprod';
const JWT_EXPIRES_IN = '7d';

export async function register(name: string, email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('E-mail já cadastrado.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('E-mail ou senha inválidos.');
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('E-mail ou senha inválidos.');
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    throw new Error('Token inválido.');
  }
}