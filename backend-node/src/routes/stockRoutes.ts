// backend-node/src/routes/stockRoutes.ts

import { Router } from 'express';
import Stock from '../models/Stock';
import { getQuote } from '../services/marketService';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas as rotas de stock exigem autenticação
router.use(authenticate);

router.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ações' });
  }
});

router.post('/stocks', async (req, res) => {
  try {
    const { ticker, name, quantity, buyPrice, purchaseDate } = req.body;
    if (!ticker || !quantity || !buyPrice || !purchaseDate) {
      return res.status(400).json({ error: 'Campos obrigatórios.' });
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
      userId: req.userId,
    });

    const saved = await newStock.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar ação' });
  }
});

router.put('/stocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ticker, name, quantity, buyPrice, purchaseDate } = req.body;

    const stock = await Stock.findOne({ _id: id, userId: req.userId });
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

router.delete('/stocks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Stock.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Ação não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar ação' });
  }
});

router.post('/stocks/refresh', async (req, res) => {
  try {
    const stocks = await Stock.find({ userId: req.userId });
    const updated: string[] = [];
    for (const stock of stocks) {
      const quote = await getQuote(stock.ticker);
      if (quote) {
        stock.currentPrice = quote.currentPrice;
        stock.previousClose = quote.previousClose;
        stock.changePercent = quote.changePercent;
        stock.lastUpdated = new Date();
        await stock.save();
        updated.push(stock.ticker);
      }
    }
    res.json({ message: `${updated.length} ações atualizadas`, updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar preços' });
  }
});

export default router;