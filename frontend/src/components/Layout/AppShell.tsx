// O "AppShell" é o esqueleto do app: ele desenha a Sidebar, a TopBar
// (mobile), a barra de progresso de leitura, o conteúdo da página
// atual (com uma transição suave entre rotas) e o Footer.
//
// A troca de página em si é feita pelo React Router. Antes, usávamos
// <Outlet /> direto; agora usamos o hook "useOutlet()", que devolve a
// MESMA página só que como um valor (um elemento React) em vez de um
// componente — isso é o que nos permite "segurar" a página antiga na
// tela por mais alguns milissegundos enquanto ela some (fade + slide
// para cima), até a nova página terminar de aparecer por baixo dela.
//
// Cada página ainda recebe os dados da carteira (lista de ações,
// totais, funções de criar/editar/apagar) através do mesmo "context",
// só que agora repassado pelo useOutlet(context) em vez do
// <Outlet context={...} />.

import { createRef, useRef, useState } from "react";
import type { RefObject } from "react";
import { useLocation, useOutlet, useOutletContext } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Footer } from "../Footer/Footer";
import { ScrollProgress } from "../ScrollProgress/ScrollProgress";
import { ToastStack } from "../Toast/ToastStack";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import styles from "./AppShell.module.css";
import transitionStyles from "./PageTransition.module.css";
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

// Mostra a página atual e anima a troca quando a rota muda. Fica em
// um componente separado só para poder usar os hooks de rota
// (useLocation/useOutlet) livremente, sem misturar com o resto do shell.
function AnimatedPage({ context }: { context: WalletContextValue }) {
  const location = useLocation();
  const element = useOutlet(context);

  // Cada rota (identificada pelo caminho da URL) ganha sua própria
  // "referência" de elemento DOM, guardada aqui. Isso evita que a
  // página que está saindo e a que está entrando disputem a mesma
  // referência ao mesmo tempo durante a transição.
  const nodeRefs = useRef(new Map<string, RefObject<HTMLDivElement>>());
  function getNodeRef(key: string) {
    if (!nodeRefs.current.has(key)) {
      nodeRefs.current.set(key, createRef<HTMLDivElement>());
    }
    return nodeRefs.current.get(key)!;
  }
  const currentRef = getNodeRef(location.pathname);

  return (
    <div className={transitionStyles.transitionRoot}>
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          nodeRef={currentRef}
          timeout={300}
          classNames={{
            enter: transitionStyles.pageEnter,
            enterActive: transitionStyles.pageEnterActive,
            exit: transitionStyles.pageExit,
            exitActive: transitionStyles.pageExitActive,
          }}
        >
          <div ref={currentRef} className={transitionStyles.pageWrapper}>
            {element}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export function AppShell({ context }: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Restaura a posição de rolagem de cada página ao navegar entre elas
  useScrollRestoration();

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
          <AnimatedPage context={context} />
        </main>

        <div className={styles.footerWrapper}>
          <Footer />
        </div>
      </div>

      <ToastStack />
    </div>
  );
}

// Hook usado DENTRO das páginas (DashboardPage, WalletPage, ReportsPage)
// para acessar os dados que vieram do App.tsx via useOutlet(context).
export function useWalletContext() {
  return useOutletContext<WalletContextValue>();
}
