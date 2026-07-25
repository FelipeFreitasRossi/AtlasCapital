// Componente simples: só mostra o topo da página (logo, título e o
// botão de "Nova Ação"). Ele não guarda nenhum estado próprio — quem
// manda ("App.tsx") é que decide o que acontece quando o botão é clicado.

import styles from "./Header.module.css";

interface HeaderProps {
  onAddStock: () => void;
}

export function Header({ onAddStock }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>AC</div>
          <div>
            <div className={styles.title}>AtlasCapital</div>
            <div className={styles.subtitle}>Gestão da carteira de investimentos</div>
          </div>
        </div>

        <button className={styles.addButton} onClick={onAddStock}>
          + Nova Ação
        </button>
      </div>
    </header>
  );
}
