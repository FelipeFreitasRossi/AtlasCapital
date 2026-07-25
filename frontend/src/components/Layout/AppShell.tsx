// O "AppShell" é o esqueleto do app: ele desenha a Sidebar, a TopBar
// (mobile) e reserva o espaço onde cada página vai aparecer.
//
// A troca de página em si é feita pelo React Router através do
// componente <Outlet />: pense nele como um "buraco" no meio do layout
// onde a página certa (Dashboard, Carteira ou Relatórios) é encaixada,
// de acordo com a URL atual.
//
// Só que as páginas precisam dos DADOS das ações (lista, totais, etc.)
// e das FUNÇÕES de criar/editar/apagar. Em vez de duplicar o hook
// "useStocks" em cada página, buscamos os dados uma única vez aqui em
// cima (no App.tsx) e repassamos para dentro do <Outlet> através do
// "context" — cada página então usa o hook "useWalletContext()" abaixo
// para pegar esse mesmo pacote de dados.

import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import styles from "./AppShell.module.css";
import type { StockWithMetrics } from "../../types/stock";

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
}

interface AppShellProps {
  context: WalletContextValue;
}

export function AppShell({ context }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
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
      </div>
    </div>
  );
}

// Hook usado DENTRO das páginas (DashboardPage, WalletPage, ReportsPage)
// para acessar os dados que vieram do App.tsx via <Outlet context={...} />.
export function useWalletContext() {
  return useOutletContext<WalletContextValue>();
}