// backend-node/src/routes/stockRoutes.ts

import { Router } from 'express';
import Stock from '../models/Stock';
import { getQuote, refreshAllPrices } from '../services/marketService';

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

// POST /stocks - Criar nova ação (com cotação real)
router.post('/stocks', async (req, res) => {
  try {
    const { ticker, name, quantity, buyPrice, purchaseDate } = req.body;

    if (!ticker || !quantity || !buyPrice || !purchaseDate) {
      return res.status(400).json({ error: 'Campos obrigatórios: ticker, quantity, buyPrice, purchaseDate' });
    }

    const quote = await getQuote(ticker);
    const currentPrice = quote?.currentPrice ?? buyPrice;
    const companyName = quote?.name ?? name ?? ticker;

    const newStock = new Stock({
      ticker: ticker.toUpperCase(),
      name: companyName,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice,
      purchaseDate,
      lastUpdated: new Date(),
      previousClose: quote?.previousClose ?? currentPrice,
      changePercent: quote?.changePercent ?? 0,
    });

    const saved = await newStock.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar ação' });
  }
});

// PUT /stocks/:id - Atualizar ação (atualiza também a cotação)
router.put('/stocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ticker, name, quantity, buyPrice, purchaseDate } = req.body;

    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ error: 'Ação não encontrada' });
    }

    if (ticker) stock.ticker = ticker.toUpperCase();
    if (name) stock.name = name;
    if (quantity) stock.quantity = Number(quantity);
    if (buyPrice) stock.buyPrice = Number(buyPrice);
    if (purchaseDate) stock.purchaseDate = purchaseDate;

    const quote = await getQuote(stock.ticker);
    if (quote) {
      stock.currentPrice = quote.currentPrice;
      stock.previousClose = quote.previousClose;
      stock.changePercent = quote.changePercent;
      stock.lastUpdated = new Date();
    }

    await stock.save();
    res.json(stock);
  } catch (error) {
    console.error(error);
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

// POST /stocks/refresh - Atualizar preços de todas as ações
router.post('/stocks/refresh', async (req, res) => {
  try {
    const result = await refreshAllPrices();
    res.json({
      message: `${result.updated} ações atualizadas`,
      updated: result.updated,
      failed: result.failed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar preços' });
  }
});

export default router;