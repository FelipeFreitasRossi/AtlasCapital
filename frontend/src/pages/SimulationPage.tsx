// frontend/src/pages/SimulationPage.tsx

import { useEffect, useState } from "react";
import { AlertTriangle, Wand2 } from "lucide-react";
import styles from "./SimulationPage.module.css";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { Reveal } from "../components/Reveal/Reveal";
import { useWalletContext } from "../components/Layout/AppShell";
import { simulateOperation } from "../services/aiService";
import type { PortfolioMetrics, SimulationResponse } from "../types/aiFeatures";

const NEW_ASSET_OPTION = "__new__";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function MetricsColumn({ title, metrics }: { title: string; metrics: PortfolioMetrics }) {
  const isPositive = metrics.profitLoss >= 0;
  return (
    <div className={styles.comparisonColumn}>
      <div className={styles.comparisonLabel}>{title}</div>
      <div className={styles.metricRow}>
        <span>Patrimônio</span>
        <span className={styles.metricValue}>{formatCurrency(metrics.currentValue)}</span>
      </div>
      <div className={styles.metricRow}>
        <span>Resultado</span>
        <span className={`${styles.metricValue} ${isPositive ? styles.positive : styles.negative}`}>
          {formatCurrency(metrics.profitLoss)} ({metrics.profitLossPercent.toFixed(1)}%)
        </span>
      </div>
      <div className={styles.metricRow}>
        <span>Concentração</span>
        <span className={styles.metricValue}>
          {metrics.concentrationRisk} {metrics.topSector ? `(${metrics.topSector})` : ""}
        </span>
      </div>
    </div>
  );
}

export function SimulationPage() {
  const { stocks } = useWalletContext();

  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [selectedOption, setSelectedOption] = useState<string>(stocks[0]?.ticker ?? NEW_ASSET_OPTION);
  const [newTicker, setNewTicker] = useState("");
  const [newName, setNewName] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState(50);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedStock = stocks.find((stock) => stock.ticker === selectedOption);
  const isNewAsset = selectedOption === NEW_ASSET_OPTION;

  useEffect(() => {
    const basePrice = selectedStock?.currentPrice ?? 50;
    setPrice(Math.round(basePrice * 100) / 100);
    setQuantity(selectedStock ? Math.max(1, Math.min(10, Math.floor(selectedStock.quantity / 2) || 1)) : 10);
  }, [selectedOption, action, selectedStock]);

  const maxQuantity = action === "sell" && selectedStock ? selectedStock.quantity : 1000;
  const referencePrice = selectedStock?.currentPrice ?? (price > 0 ? price : 50);
  const priceMin = Math.max(0.01, referencePrice * 0.5);
  const priceMax = referencePrice * 1.5;

  async function handleSimulate() {
    const ticker = isNewAsset ? newTicker.trim().toUpperCase() : selectedOption;
    if (!ticker) {
      setError("Informe o ticker do ativo.");
      return;
    }
    if (action === "sell" && !selectedStock) {
      setError("Selecione um ativo que já esteja na sua carteira para simular uma venda.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await simulateOperation({
        stocks,
        action,
        ticker,
        name: isNewAsset ? newName.trim() || ticker : selectedStock?.name,
        quantity,
        price,
        currentPrice: selectedStock?.currentPrice,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível simular essa operação.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Simulação" subtitle='Veja o impacto de uma compra ou venda hipotética ("E se")' />

      <Reveal delay={0}>
        <div className={styles.layout}>
          <div className={styles.formCard}>
            <div className={styles.cardTitle}>Configurar operação</div>

            <div className={styles.actionToggle}>
              <button
                type="button"
                className={`${styles.actionButton} ${action === "buy" ? styles.actionButtonActiveBuy : ""}`}
                onClick={() => setAction("buy")}
              >
                Comprar
              </button>
              <button
                type="button"
                className={`${styles.actionButton} ${action === "sell" ? styles.actionButtonActiveSell : ""}`}
                onClick={() => setAction("sell")}
              >
                Vender
              </button>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="sim-ticker">
                Ativo
              </label>
              <select
                id="sim-ticker"
                className={styles.select}
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {stocks.map((stock) => (
                  <option key={stock.id} value={stock.ticker}>
                    {stock.ticker} — {stock.name}
                  </option>
                ))}
                {action === "buy" && <option value={NEW_ASSET_OPTION}>+ Novo ativo (fora da carteira)</option>}
              </select>
            </div>

            {isNewAsset && action === "buy" && (
              <>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="sim-new-ticker">
                    Ticker
                  </label>
                  <input
                    id="sim-new-ticker"
                    className={styles.input}
                    placeholder="Ex: VALE3"
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="sim-new-name">
                    Nome da empresa
                  </label>
                  <input
                    id="sim-new-name"
                    className={styles.input}
                    placeholder="Ex: Vale"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="sim-quantity">
                Quantidade
              </label>
              <div className={styles.sliderRow}>
                <input
                  id="sim-quantity"
                  type="range"
                  className={styles.slider}
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <span className={styles.sliderValue}>{quantity} ações</span>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="sim-price">
                Preço da operação
              </label>
              <div className={styles.sliderRow}>
                <input
                  id="sim-price"
                  type="range"
                  className={styles.slider}
                  min={priceMin}
                  max={priceMax}
                  step={0.01}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
                <span className={styles.sliderValue}>{formatCurrency(price)}</span>
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button className={styles.submitButton} onClick={handleSimulate} disabled={isLoading}>
              <Wand2 size={16} style={{ marginRight: 6, verticalAlign: "text-bottom" }} />
              {isLoading ? "Simulando..." : "Simular"}
            </button>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.cardTitle}>Resultado da simulação</div>

            {!result && <div className={styles.emptyState}>Configure a operação ao lado e clique em "Simular".</div>}

            {result && (
              <>
                <div className={styles.deltaBanner}>
                  <span>Variação de patrimônio</span>
                  <span className={result.deltaCurrentValue >= 0 ? styles.positive : styles.negative}>
                    {result.deltaCurrentValue >= 0 ? "+" : ""}
                    {formatCurrency(result.deltaCurrentValue)}
                  </span>
                </div>

                <div className={styles.comparisonGrid}>
                  <MetricsColumn title="Antes" metrics={result.before} />
                  <MetricsColumn title="Depois" metrics={result.after} />
                </div>

                {result.warning && (
                  <div className={styles.warningBanner}>
                    <AlertTriangle size={16} />
                    {result.warning}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}