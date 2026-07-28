// frontend/src/components/Diversification/DiversificationCard.tsx

import { useEffect, useState } from "react";
import { Lightbulb, PieChart } from "lucide-react";
import styles from "./DiversificationCard.module.css";
import { getDiversification } from "../../services/aiService";
import type { DiversificationResponse } from "../../types/aiFeatures";
import type { StockWithMetrics } from "../../types/stock";

interface DiversificationCardProps {
  stocks: StockWithMetrics[];
}

const RISK_CLASS: Record<string, string> = {
  baixo: styles.riskBaixo,
  médio: styles.riskMedio,
  alto: styles.riskAlto,
};

export function DiversificationCard({ stocks }: DiversificationCardProps) {
  const [data, setData] = useState<DiversificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stocks.length === 0) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    getDiversification(stocks)
      .then((result) => {
        if (!isCancelled) setData(result);
      })
      .catch(() => {
        if (!isCancelled) setError("Não foi possível carregar a análise de diversificação. O backend Python está rodando?");
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [stocks]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.iconBadge}>
            <PieChart size={17} />
          </div>
          <div className={styles.title}>Dica de diversificação</div>
        </div>
        {data && (
          <span className={`${styles.riskBadge} ${RISK_CLASS[data.concentrationRisk]}`}>
            Risco {data.concentrationRisk}
          </span>
        )}
      </div>

      {isLoading && <div className={styles.loadingState}>Analisando sua carteira...</div>}
      {error && !isLoading && <div className={styles.errorState}>{error}</div>}
      {!isLoading && !error && stocks.length === 0 && (
        <div className={styles.emptyState}>Cadastre ações para receber uma análise de diversificação.</div>
      )}

      {!isLoading && !error && data && data.sectorBreakdown.length > 0 && (
        <>
          <div className={styles.bars}>
            {data.sectorBreakdown.map((item) => (
              <div className={styles.barRow} key={item.sector}>
                <span className={styles.barLabel}>{item.sector}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${item.percent}%` }} />
                </div>
                <span className={styles.barPercent}>{item.percent.toFixed(1)}%</span>
              </div>
            ))}
          </div>

          <div className={styles.suggestions}>
            {data.suggestions.map((suggestion) => (
              <div className={styles.suggestion} key={suggestion}>
                <Lightbulb size={14} className={styles.suggestionIcon} />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}