// frontend/src/components/Layout/AppShell.tsx

import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Footer } from '../Footer/Footer';
import { ScrollProgress } from '../ScrollProgress/ScrollProgress';
import { ToastStack } from '../Toast/ToastStack';
import styles from './AppShell.module.css';
import type { StockWithMetrics } from '../../types/stock';

export interface WalletContextValue {
  stocks: StockWithMetrics[];
  totals: {
    investedValue: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercent: number;
  };
  isLoading: boolean;
  error: string | null;
  openCreateForm: () => void;
  openEditForm: (stock: StockWithMetrics) => void;
  handleDelete: (stock: StockWithMetrics) => void;
  refreshPrices: () => Promise<void>;
}

interface AppShellProps {
  context: WalletContextValue;
}

export function AppShell({ context }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <ScrollProgress />
      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAddStock={context.openCreateForm}
      />

      <div className={styles.mainColumn}>
        <TopBar onOpenMenu={() => setIsMenuOpen(true)} />

        <main className={styles.content}>
          <Outlet context={context} />
        </main>

        <Footer />
      </div>

      <ToastStack />
    </div>
  );
}

// Hook para usar o contexto dentro das páginas
export function useWalletContext() {
  return useOutletContext<WalletContextValue>();
}