// frontend/src/services/aiService.ts
// Este service concentra todas as chamadas para o backend Python
// (funcionalidades inteligentes: previsão, diversificação, simulação e alertas).

import { PYTHON_API_URL } from "./apiConfig";
import type { Stock } from "../types/stock";
import type {
  AlertCheckResponse,
  AlertCreateInput,
  AlertOut,
  DiversificationResponse,
  ForecastResponse,
  HorizonDays,
  SimulationRequest,
  SimulationResponse,
} from "../types/aiFeatures";

async function parseOrThrow<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    let detail = fallbackMessage;
    try {
      const body = await response.json();
      detail = body.detail ?? fallbackMessage;
    } catch {
      // resposta sem corpo JSON
    }
    throw new Error(detail);
  }
  return response.json();
}

// 1) Previsão de preço
export async function getForecast(ticker: string, currentPrice: number, horizonDays: HorizonDays): Promise<ForecastResponse> {
  const response = await fetch(`${PYTHON_API_URL}/forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker, currentPrice, horizonDays }),
  });
  return parseOrThrow(response, "Não foi possível gerar a previsão.");
}

// 2) Diversificação
export async function getDiversification(stocks: Stock[]): Promise<DiversificationResponse> {
  const response = await fetch(`${PYTHON_API_URL}/diversification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stocks }),
  });
  return parseOrThrow(response, "Não foi possível analisar a diversificação.");
}

// 3) Simulação "E se"
export async function simulateOperation(payload: SimulationRequest): Promise<SimulationResponse> {
  const response = await fetch(`${PYTHON_API_URL}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseOrThrow(response, "Não foi possível simular essa operação.");
}

// 4) Alertas
export async function listAlerts(): Promise<AlertOut[]> {
  const response = await fetch(`${PYTHON_API_URL}/alerts`);
  return parseOrThrow(response, "Não foi possível carregar os alertas.");
}

export async function createAlert(data: AlertCreateInput): Promise<AlertOut> {
  const response = await fetch(`${PYTHON_API_URL}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, "Não foi possível criar o alerta.");
}

export async function deleteAlert(id: string): Promise<void> {
  const response = await fetch(`${PYTHON_API_URL}/alerts/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Não foi possível apagar o alerta.");
}

export async function checkAlerts(stocks: Stock[], totalPortfolioValue: number): Promise<AlertCheckResponse> {
  const response = await fetch(`${PYTHON_API_URL}/alerts/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stocks, totalPortfolioValue }),
  });
  return parseOrThrow(response, "Não foi possível verificar os alertas.");
}