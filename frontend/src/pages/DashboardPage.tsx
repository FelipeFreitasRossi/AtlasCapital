// frontend/src/pages/DashboardPage.tsx

import pageStyles from "./Page.module.css";
import { StatsCards } from "../components/StatsCards/StatsCards";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { ExportButtons } from "../components/ExportButtons/ExportButtons";
import { DiversificationCard } from "../components/Diversification/DiversificationCard";
import { Reveal } from "../components/Reveal/Reveal";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { useWalletContext } from "../components/Layout/AppShell";

export function DashboardPage() {
  const { stocks, totals, isLoading, error } = useWalletContext();

  if (isLoading) {
    return <div className={pageStyles.loadingState}>Carregando sua carteira...</div>;
  }

  if (error) {
    return <div className={pageStyles.errorState}>{error}</div>;
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral da sua carteira de investimentos" />

      <Reveal delay={0}>
        <StatsCards
          investedValue={totals.investedValue}
          currentValue={totals.currentValue}
          profitLoss={totals.profitLoss}
          profitLossPercent={totals.profitLossPercent}
          stockCount={stocks.length}
        />
      </Reveal>

      <Reveal delay={0.12} className={pageStyles.sectionGap}>
        <Dashboard stocks={stocks} />
      </Reveal>

      <Reveal delay={0.16} className={pageStyles.sectionGap}>
        <DiversificationCard stocks={stocks} />
      </Reveal>

      <Reveal delay={0.2} className={pageStyles.sectionGap}>
        <div className={pageStyles.toolbar}>
          <div className={pageStyles.sectionTitle}>Exportação rápida</div>
        </div>
        <ExportButtons stocks={stocks} />
      </Reveal>
    </div>
  );
}