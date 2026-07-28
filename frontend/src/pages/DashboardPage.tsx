// frontend/src/pages/DashboardPage.tsx

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import pageStyles from './Page.module.css';
import { StatsCards } from '../components/StatsCards/StatsCards';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { ExportButtons } from '../components/ExportButtons/ExportButtons';
import { DiversificationCard } from '../components/Diversification/DiversificationCard';
import { Reveal } from '../components/Reveal/Reveal';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { useWalletContext } from '../components/Layout/AppShell';
import { pushToast } from '../components/Toast/toastStore';

export function DashboardPage() {
  const { stocks, totals, isLoading, error, refreshPrices } = useWalletContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isLoading) {
    return <div className={pageStyles.loadingState}>Aguarde...</div>;
  }

  if (error) {
    return <div className={pageStyles.errorState}>{error}</div>;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPrices();
      pushToast('Preços atualizados com sucesso!', 'success');
    } catch {
      pushToast('Erro ao atualizar preços. Tente novamente.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      <div className={pageStyles.toolbar}>
        <PageHeader title="Dashboard" subtitle="Visão geral da sua carteira de investimentos" />
        <button
          className={pageStyles.refreshButton}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} className={isRefreshing ? pageStyles.spinning : ''} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar cotações'}
        </button>
      </div>

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