import { Router } from 'express';
import Stock from '../models/Stock';

const router = Router();

// GET /stocks - Listar todas as ações
router.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ações' });
  }
});

// POST /stocks - Criar nova ação
router.post('/stocks', async (req, res) => {
  try {
    const { ticker, name, quantity, buyPrice, currentPrice, purchaseDate } = req.body;

    // Validação básica
    if (!ticker || !name || !quantity || !buyPrice || !currentPrice || !purchaseDate) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const newStock = new Stock({
      ticker: ticker.toUpperCase(),
      name,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice: Number(currentPrice),
      purchaseDate,
    });

    const saved = await newStock.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar ação' });
  }
});

// PUT /stocks/:id - Atualizar ação
router.put('/stocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ticker, name, quantity, buyPrice, currentPrice, purchaseDate } = req.body;

    const updated = await Stock.findByIdAndUpdate(
      id,
      {
        ticker: ticker.toUpperCase(),
        name,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
        currentPrice: Number(currentPrice),
        purchaseDate,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Ação não encontrada' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar ação' });
  }
});

// DELETE /stocks/:id - Deletar ação
router.delete('/stocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Stock.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Ação não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar ação' });
  }
});

export default router;