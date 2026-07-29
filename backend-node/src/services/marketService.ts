// backend-node/src/services/marketService.ts

import yahooFinance from 'yahoo-finance2';
import Stock from '../models/Stock';

export interface StockQuote {
  ticker: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
}

export async function getQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const symbols = [ticker, `${ticker}.SA`];

    for (const symbol of symbols) {
      try {
        // Usamos 'any' para evitar problemas de tipo com a biblioteca
        const quote: any = await yahooFinance.quote(symbol);

        if (quote && typeof quote.regularMarketPrice === 'number') {
          const price = quote.regularMarketPrice;
          const previousClose = quote.regularMarketPreviousClose || price;

          return {
            ticker: ticker.toUpperCase(),
            name: quote.longName || quote.shortName || ticker,
            currentPrice: price,
            previousClose: previousClose,
            change: price - previousClose,
            changePercent: (price / previousClose) - 1,
            marketCap: quote.marketCap,
            volume: quote.regularMarketVolume,
          };
        }
      } catch (e) {
        // Tenta o próximo símbolo
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error(`Erro ao buscar cotação para ${ticker}:`, error);
    return null;
  }
}

export async function refreshAllPrices(): Promise<{ updated: number; failed: string[] }> {
  try {
    const stocks = await Stock.find();
    let updated = 0;
    const failed: string[] = [];

    for (const stock of stocks) {
      const quote = await getQuote(stock.ticker);
      if (quote) {
        stock.currentPrice = quote.currentPrice;
        stock.previousClose = quote.previousClose;
        stock.changePercent = quote.changePercent;
        stock.lastUpdated = new Date();
        await stock.save();
        updated++;
      } else {
        failed.push(stock.ticker);
      }
    }

    return { updated, failed };
  } catch (error) {
    console.error('Erro ao atualizar preços:', error);
    return { updated: 0, failed: [] };
  }
}