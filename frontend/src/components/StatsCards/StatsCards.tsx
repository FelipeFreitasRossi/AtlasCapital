// Mesma ideia da versão anterior (3 cartões com os números principais),
// mas agora com um ícone em cada cartão e os números "subindo" do zero
// até o valor final assim que a tela carrega (animação de count-up),
// usando o hook "useCountUp".

import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import styles from "./StatsCards.module.css";
import { useCountUp } from "../../hooks/useCountUp";

interface StatsCardsProps {
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  stockCount: number;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function StatsCards({
  investedValue,
  currentValue,
  profitLoss,
  profitLossPercent,
  stockCount,
}: StatsCardsProps) {
  const isPositive = profitLoss >= 0;

  // Cada número é animado de forma independente
  const animatedInvested = useCountUp(investedValue);
  const animatedCurrent = useCountUp(currentValue);
  const animatedProfit = useCountUp(profitLoss);

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.iconBadge}>
          <PiggyBank size={18} />
        </div>
        <div className={styles.label}>Valor investido</div>
        <div className={styles.value}>{formatCurrency(animatedInvested)}</div>
        <div className={styles.hint}>
          {stockCount} {stockCount === 1 ? "ativo" : "ativos"} na carteira
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.iconBadge}>
          <Wallet size={18} />
        </div>
        <div className={styles.label}>Patrimônio atual</div>
        <div className={styles.value}>{formatCurrency(animatedCurrent)}</div>
        <div className={styles.hint}>Valor de mercado hoje</div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconBadge} ${isPositive ? styles.iconPositive : styles.iconNegative}`}>
          {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </div>
        <div className={styles.label}>Resultado consolidado</div>
        <div className={`${styles.value} ${isPositive ? styles.positive : styles.negative}`}>
          {formatCurrency(animatedProfit)}
        </div>
        <div className={`${styles.hint} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? "+" : ""}
          {profitLossPercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}