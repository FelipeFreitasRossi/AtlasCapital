// Página inicial do app. Reúne o resumo da carteira (StatsCards), o
// gráfico de rendimento (Dashboard) e os botões de exportação rápida.
// Os dados vêm do "AppShell" através do useWalletContext — esta página
// não busca dados sozinha, só decide como exibi-los.

import pageStyles from "./Page.module.css";
import { StatsCards } from "../components/StatsCards/StatsCards";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { ExportButtons } from "../components/ExportButtons/ExportButtons";
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

      {/* Sequência natural: primeiro os números (StatsCards), depois o
          gráfico que os explica visualmente, e por fim a ação de exportar. */}
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

      <Reveal delay={0.18} className={pageStyles.sectionGap}>
        <div className={pageStyles.toolbar}>
          <div className={pageStyles.sectionTitle}>Exportação rápida</div>
        </div>
        <ExportButtons stocks={stocks} />
      </Reveal>
    </div>
  );
}
