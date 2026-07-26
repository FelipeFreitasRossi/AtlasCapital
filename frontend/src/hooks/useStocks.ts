// Um "hook" é uma função especial do React que guarda e organiza
// um pedaço de lógica que pode ser reaproveitado. Aqui, ele guarda
// TUDO relacionado às ações: a lista, se está carregando, erros,
// e as funções de criar/editar/apagar.
//
// Assim, o componente App.tsx fica limpo, só chamando "useStocks()"
// e usando o que ele devolve, sem precisar saber os detalhes de
// como os dados são buscados ou calculados.

import { useCallback, useEffect, useMemo, useState } from "react";
import { createStock, deleteStock, getStocks, updateStock } from "../services/stockService";
import type { Stock, StockInput, StockWithMetrics } from "../types/stock";

export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca a lista de ações assim que o app abre
  const loadStocks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStocks();
      setStocks(data);
    } catch {
      setError("Não foi possível carregar suas ações. Tente novamente em instantes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  // Cria ou atualiza uma ação, dependendo se um "id" foi passado
  const saveStock = useCallback(async (data: StockInput, id?: string) => {
    if (id) {
      const updated = await updateStock(id, data);
      setStocks((prev) => prev.map((stock) => (stock.id === id ? updated : stock)));
    } else {
      const created = await createStock(data);
      setStocks((prev) => [...prev, created]);
    }
  }, []);

  const removeStock = useCallback(async (id: string) => {
    await deleteStock(id);
    setStocks((prev) => prev.filter((stock) => stock.id !== id));
  }, []);

  // "useMemo" recalcula os números só quando a lista de ações muda,
  // em vez de recalcular a cada vez que a tela é redesenhada.
  // Aqui adicionamos, para cada ação, o quanto foi investido, o
  // valor atual e o lucro/prejuízo (em R$ e em %).
  const stocksWithMetrics: StockWithMetrics[] = useMemo(() => {
    return stocks.map((stock) => {
      const investedValue = stock.quantity * stock.buyPrice;
      const currentValue = stock.quantity * stock.currentPrice;
      const profitLoss = currentValue - investedValue;
      const profitLossPercent = investedValue === 0 ? 0 : (profitLoss / investedValue) * 100;

      return { ...stock, investedValue, currentValue, profitLoss, profitLossPercent };
    });
  }, [stocks]);

  // Totais gerais da carteira, usados no Dashboard
  const totals = useMemo(() => {
    const investedValue = stocksWithMetrics.reduce((sum, s) => sum + s.investedValue, 0);
    const currentValue = stocksWithMetrics.reduce((sum, s) => sum + s.currentValue, 0);
    const profitLoss = currentValue - investedValue;
    const profitLossPercent = investedValue === 0 ? 0 : (profitLoss / investedValue) * 100;

    return { investedValue, currentValue, profitLoss, profitLossPercent };
  }, [stocksWithMetrics]);

  return {
    stocks: stocksWithMetrics,
    totals,
    isLoading,
    error,
    saveStock,
    removeStock,
    reload: loadStocks,
  };
}
