// frontend/src/services/stockService.ts

import { API_BASE_URL, getAuthHeaders } from './apiConfig';
import type { Stock, StockInput } from '../types/stock';

export const stockService = {
  async getAll(): Promise<Stock[]> {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar ações');
    return response.json();
  },

  async create(data: StockInput): Promise<Stock> {
    const response = await fetch(`${API_BASE_URL}/stocks`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar ação');
    }
  },

  async refreshPrices(): Promise<{ updated: number; failed: string[] }> {
    const response = await fetch(`${API_BASE_URL}/stocks/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar preços');
    }
    return response.json();
  },
};