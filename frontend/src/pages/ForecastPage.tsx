// frontend/src/pages/ForecastPage.tsx

import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { TrendingDown, TrendingUp, Minus, Sparkles } from "lucide-react";
import forecastStyles from "./ForecastPage.module.css";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { Reveal } from "../components/Reveal/Reveal";
import { useWalletContext } from "../components/Layout/AppShell";
import { getForecast } from "../services/aiService";
import { StockSelector } from "../components/StockSelector/StockSelector";
import type { ForecastResponse, HorizonDays } from "../types/aiFeatures";

const HORIZON_OPTIONS: HorizonDays[] = [7, 30, 90];

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateLabel(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${day}/${month}`;
}

interface ChartRow {
  date: string;
  price?: number;
  predictedPrice?: number;
  lowerBound?: number;
  bandWidth?: number;
}

function buildChartData(forecast: ForecastResponse): ChartRow[] {
  const recentHistory = forecast.historical.slice(-30);
  const historyRows: ChartRow[] = recentHistory.map((point) => ({
    date: point.date,
    price: point.price,
  }));

  const forecastRows: ChartRow[] = forecast.forecast.map((point) => ({
    date: point.date,
    predictedPrice: point.predictedPrice,
    lowerBound: point.lowerBound,
    bandWidth: point.upperBound - point.lowerBound,
  }));

  if (historyRows.length > 0) {
    const lastHistory = historyRows[historyRows.length - 1];
    forecastRows.unshift({ date: lastHistory.date, predictedPrice: lastHistory.price });
  }

  return [...historyRows, ...forecastRows];
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const priceEntry = payload.find((entry) => entry.dataKey === "price");
  const predictedEntry = payload.find((entry) => entry.dataKey === "predictedPrice");

  return (
    <div className={forecastStyles.tooltip}>
      <strong>{formatDateLabel(String(label))}</strong>
      {priceEntry && typeof priceEntry.value === "number" && <div>Histórico: {formatCurrency(priceEntry.value)}</div>}
      {predictedEntry && typeof predictedEntry.value === "number" && (
        <div>Previsto: {formatCurrency(predictedEntry.value)}</div>
      )}
    </div>
  );
}

const TREND_ICON = { alta: TrendingUp, queda: TrendingDown, estável: Minus };
const TREND_CLASS: Record<string, string> = {
  alta: forecastStyles.trendAlta,
  queda: forecastStyles.trendQueda,
  estável: forecastStyles.trendEstavel,
};

export function ForecastPage() {
  const { stocks } = useWalletContext();

  const [selectedTicker, setSelectedTicker] = useState(stocks[0]?.ticker ?? "");
  const [horizonDays, setHorizonDays] = useState<HorizonDays>(30);
  const [result, setResult] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStock = stocks.find((stock) => stock.ticker === selectedTicker);

  async function handleForecast() {
    if (!selectedStock) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getForecast(selectedStock.ticker, selectedStock.currentPrice, horizonDays);
      setResult(response);
    } catch {
      setError("Não foi possível gerar a previsão. Verifique se o backend Python está rodando em localhost:8000.");
    } finally {
      setIsLoading(false);
    }
  }

  const TrendIcon = result ? TREND_ICON[result.trend] : null;
  const chartData = result ? buildChartData(result) : [];

  return (
    <div>
      <PageHeader title="Previsão" subtitle="Projeção de preço com base em tendência histórica" />

      <Reveal delay={0}>
        {stocks.length === 0 ? (
          <div className={forecastStyles.card}>
            <div className={forecastStyles.emptyState}>
              Cadastre ações na sua carteira para gerar uma previsão de preço.
            </div>
          </div>
        ) : (
          <>
            <div className={forecastStyles.controls}>
              <div className={forecastStyles.field}>
                <StockSelector
                  stocks={stocks.map((s) => ({ id: s.id, ticker: s.ticker, name: s.name }))}
                  value={selectedTicker}
                  onChange={setSelectedTicker}
                  label="Ação"
                  placeholder="Buscar ação..."
                />
              </div>

              <div className={forecastStyles.field}>
                <span className={forecastStyles.label}>Horizonte</span>
                <div className={forecastStyles.horizonGroup}>
                  {HORIZON_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${forecastStyles.horizonButton} ${
                        horizonDays === option ? forecastStyles.horizonButtonActive : ""
                      }`}
                      onClick={() => setHorizonDays(option)}
                    >
                      {option} dias
                    </button>
                  ))}
                </div>
              </div>

              <button className={forecastStyles.submitButton} onClick={handleForecast} disabled={isLoading}>
                <Sparkles size={16} />
                {isLoading ? "Calculando..." : "Prever"}
              </button>
            </div>

            <div className={forecastStyles.card}>
              {error && <div className={forecastStyles.errorState}>{error}</div>}

              {!error && !result && (
                <div className={forecastStyles.emptyState}>
                  Escolha uma ação e clique em "Prever" para ver a projeção.
                </div>
              )}

              {!error && result && (
                <>
                  <div className={forecastStyles.cardHeader}>
                    <div className={forecastStyles.cardTitle}>
                      {result.ticker} · próximos {result.horizonDays} dias
                    </div>
                    {TrendIcon && (
                      <span className={`${forecastStyles.trendBadge} ${TREND_CLASS[result.trend]}`}>
                        <TrendIcon size={14} />
                        Tendência de {result.trend}
                      </span>
                    )}
                  </div>

                  <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDateLabel}
                        tick={{ fontSize: 11, fill: "#97a3b6" }}
                        axisLine={{ stroke: "rgba(148,163,184,0.18)" }}
                        tickLine={false}
                        minTickGap={24}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#97a3b6" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => formatCurrency(Number(value))}
                        width={80}
                        domain={["auto", "auto"]}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      <Area dataKey="lowerBound" stackId="band" stroke="none" fill="transparent" />
                      <Area dataKey="bandWidth" stackId="band" stroke="none" fill="#d4af37" fillOpacity={0.15} />

                      <Line dataKey="price" stroke="#5fd4e0" strokeWidth={2} dot={false} name="Histórico" />
                      <Line
                        dataKey="predictedPrice"
                        stroke="#d4af37"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={false}
                        name="Previsto"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>

                  <div className={forecastStyles.methodNote}>
                    Método: {result.method}. A área dourada representa o intervalo de confiança da projeção —
                    quanto mais distante no tempo, maior a incerteza. Esta previsão é ilustrativa e não constitui
                    recomendação de investimento.
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Reveal>
    </div>
  );
}