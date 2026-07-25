import { useState, useEffect } from 'react';
import { stockService } from '../services/stockService';
import type { Stock, StockInput, StockWithMetrics } from '../types/stock';

// Função auxiliar para calcular métricas (lucro/prejuízo)
function enrichStock(stock: Stock): StockWithMetrics {
  const invested = stock.quantity * stock.buyPrice;
  const current = stock.quantity * stock.currentPrice;
  const profitLoss = current - invested;
  const profitLossPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;
  return {
    ...stock,
    investedValue: invested,
    currentValue: current,
    profitLoss,
    profitLossPercent,
  };
}

export function useStocks() {
  const [stocks, setStocks] = useState<StockWithMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados
  async function fetchStocks() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await stockService.getAll();
      const enriched = data.map(enrichStock);
      setStocks(enriched);
    } catch (err) {
      setError('Erro ao carregar ações. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Salvar (criar ou atualizar)
  async function saveStock(data: StockInput, id?: string) {
    try {
      let saved: Stock;
      if (id) {
        saved = await stockService.update(id, data);
      } else {
        saved = await stockService.create(data);
      }
      // Atualiza a lista local
      setStocks(prev => {
        const enriched = enrichStock(saved);
        if (id) {
          // Edição: substitui o antigo
          return prev.map(s => s.id === id ? enriched : s);
        } else {
          // Criação: adiciona no início
          return [enriched, ...prev];
        }
      });
    } catch (err) {
      console.error('Erro ao salvar ação:', err);
      throw err;
    }
  }

  // Remover
  async function removeStock(id: string) {
    try {
      await stockService.delete(id);
      setStocks(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Erro ao deletar ação:', err);
      throw err;
    }
  }

  // Carregar ao montar
  useEffect(() => {
    fetchStocks();
  }, []);

  // Calcular totais
  const totals = stocks.reduce(
    (acc, s) => {
      acc.investedValue += s.investedValue;
      acc.currentValue += s.currentValue;
      acc.profitLoss += s.profitLoss;
      return acc;
    },
    { investedValue: 0, currentValue: 0, profitLoss: 0 }
  );

  const profitLossPercent = totals.investedValue > 0
    ? (totals.profitLoss / totals.investedValue) * 100
    : 0;

  return {
    stocks,
    totals: {
      ...totals,
      profitLossPercent,
    },
    isLoading,
    error,
    fetchStocks,
    saveStock,
    removeStock,
  };
}