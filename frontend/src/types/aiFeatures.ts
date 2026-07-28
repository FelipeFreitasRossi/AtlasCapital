// frontend/src/types/aiFeatures.ts
// Estes tipos espelham, campo a campo, os modelos Pydantic definidos
// em backend-python/app/models/schemas.py. Mantê-los sincronizados ajuda a
// pegar erros de integração em tempo de compilação (TypeScript) em vez de só em tempo de execução.

import type { Stock } from "./stock";

// ---------------------------------------------------------------------
// 1) Previsão de preço
// ---------------------------------------------------------------------
export type HorizonDays = 7 | 30 | 90;

export interface PricePoint {
  date: string;
  price: number;
}

export interface ForecastPoint {
  date: string;
  predictedPrice: number;
  lowerBound: number;
  upperBound: number;
}

export interface ForecastResponse {
  ticker: string;
  horizonDays: number;
  method: string;
  generatedAt: string;
  historical: PricePoint[];
  forecast: ForecastPoint[];
  trend: "alta" | "queda" | "estável";
}

// ---------------------------------------------------------------------
// 2) Diversificação
// ---------------------------------------------------------------------
export interface SectorBreakdownItem {
  sector: string;
  value: number;
  percent: number;
}

export type ConcentrationRisk = "baixo" | "médio" | "alto";

export interface DiversificationResponse {
  sectorBreakdown: SectorBreakdownItem[];
  concentrationRisk: ConcentrationRisk;
  topSector: string | null;
  suggestions: string[];
}

// ---------------------------------------------------------------------
// 3) Simulação "E se"
// ---------------------------------------------------------------------
export interface SimulationRequest {
  stocks: Stock[];
  action: "buy" | "sell";
  ticker: string;
  name?: string;
  quantity: number;
  price: number;
  currentPrice?: number;
}

export interface PortfolioMetrics {
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  concentrationRisk: ConcentrationRisk;
  topSector: string | null;
  sectorBreakdown: SectorBreakdownItem[];
}

export interface SimulationResponse {
  before: PortfolioMetrics;
  after: PortfolioMetrics;
  deltaCurrentValue: number;
  deltaProfitLoss: number;
  warning: string | null;
}

// ---------------------------------------------------------------------
// 4) Alertas
// ---------------------------------------------------------------------
export type AlertType = "price_drop_percent" | "price_target_above" | "price_target_below" | "portfolio_value_above";

export interface AlertCreateInput {
  type: AlertType;
  ticker?: string;
  thresholdPercent?: number;
  thresholdPrice?: number;
  thresholdValue?: number;
}

export interface AlertOut extends AlertCreateInput {
  id: string;
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string | null;
  message?: string | null;
}

export interface AlertCheckResponse {
  checkedAt: string;
  newlyTriggered: AlertOut[];
  allAlerts: AlertOut[];
}