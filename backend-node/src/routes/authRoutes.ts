// backend-node/src/routes/authRoutes.ts

import { Router } from 'express';
import { register, login } from '../services/authService';
import { authenticate } from '../middleware/auth'; // 👈 importação adicionada
import User from '../models/User';

const router = Router();

/**
 * POST /auth/register
 * Registra um novo usuário
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await register(name, email, password);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /auth/login
 * Autentica um usuário e retorna um token JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

/**
 * GET /auth/me
 * Retorna os dados do usuário autenticado (protegido)
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

export default router;