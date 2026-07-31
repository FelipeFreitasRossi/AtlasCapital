import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Dashboard.module.css";
import type { StockWithMetrics } from "../../types/stock";

gsap.registerPlugin(ScrollTrigger);

interface DashboardProps {
  stocks: StockWithMetrics[];
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Componente customizado do "balão" que aparece ao passar o mouse na barra
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload as StockWithMetrics;
  return (
    <div className={styles.tooltip}>
      <strong>{item.ticker}</strong>
      <div>{formatCurrency(item.profitLoss)}</div>
    </div>
  );
}

export function Dashboard({ stocks }: DashboardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Só renderizamos o gráfico de verdade depois que ele entra na tela,
  // pra garantir que a animação de "crescer" do Recharts aconteça
  // exatamente nesse momento (e não escondida, antes do usuário rolar).
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    if (!cardRef.current || stocks.length === 0) return;

    const trigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => setHasEnteredView(true),
    });

    return () => trigger.kill();
  }, [stocks.length]);

  if (stocks.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyState}>
          Cadastre sua primeira ação para ver o gráfico de rendimento aqui.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Rendimento por ativo</div>
          <div className={styles.subtitle}>Lucro (verde) e prejuízo (vermelho) de cada ação</div>
        </div>
      </div>

      {!hasEnteredView ? (
        <div className={styles.placeholder} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stocks} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis
              dataKey="ticker"
              tick={{ fontSize: 12, fill: "#97a3b6" }}
              axisLine={{ stroke: "rgba(148,163,184,0.18)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#97a3b6" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCurrency(Number(value))}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
            <Bar dataKey="profitLoss" radius={[6, 6, 0, 0]} animationDuration={900} animationEasing="ease-out">
              {stocks.map((stock) => (
                <Cell key={stock.id} fill={stock.profitLoss >= 0 ? "#3ddc84" : "#ff6b6b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
