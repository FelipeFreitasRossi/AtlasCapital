// services/stockService.ts
import type { Stock, StockInput } from '../types/stock';

// Simula um banco de dados local (para testes enquanto o backend não está pronto)
let mockDB: Stock[] = [];
let nextId = 1;

export const stockService = {
  async getAll(): Promise<Stock[]> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDB;
  },

  async create(data: StockInput): Promise<Stock> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newStock: Stock = {
      id: String(nextId++),
      ...data,
    };
    mockDB.push(newStock);
    return newStock;
  },

  async update(id: string, data: StockInput): Promise<Stock> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDB.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Ação não encontrada');
    const updated = { ...mockDB[index], ...data };
    mockDB[index] = updated;
    return updated;
  },

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockDB = mockDB.filter(s => s.id !== id);
  }
};