// frontend/src/services/stockService.ts

import { API_BASE_URL } from './apiConfig';
import type { Stock, StockInput } from '../types/stock';

// Simula um banco de dados local (para testes enquanto o backend não está pronto)
// Se o backend estiver rodando, essas funções são substituídas pelas chamadas reais.
// Como já temos o backend Node, vamos usar as chamadas reais.

export const stockService = {
  async getAll(): Promise<Stock[]> {
    const response = await fetch(`${API_BASE_URL}/stocks`);
    if (!response.ok) throw new Error('Erro ao buscar ações');
    return response.json();
  },

  async create(data: StockInput): Promise<Stock> {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar ação');
    }
    return response.json();
  },

  async update(id: string, data: StockInput): Promise<Stock> {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar ação');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/stocks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar ação');
    }
  },

  // NOVO: Atualizar preços de todas as ações
  async refreshPrices(): Promise<{ updated: number; failed: string[] }> {
    const response = await fetch(`${API_BASE_URL}/stocks/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar preços');
    }
    return response.json();
  },
};