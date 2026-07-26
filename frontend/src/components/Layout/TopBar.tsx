// Barra que só aparece em telas pequenas (o CSS cuida de escondê-la no
// desktop, onde a Sidebar já fica sempre visível). Ela tem o botão de
// menu (☰) e muda de aparência (fundo mais opaco + linha embaixo)
// conforme o usuário rola a página — um efeito sutil de profundidade.

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import styles from "./Sidebar.module.css";

interface TopBarProps {
  onOpenMenu: () => void;
}

export function TopBar({ onOpenMenu }: TopBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.topBar} ${isScrolled ? styles.topBarScrolled : ""}`}>
      <div className={styles.topBarBrand}>
        <div className={styles.logo}>AC</div>
        AtlasCapital
      </div>
      <button className={styles.menuButton} onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
    </header>
  );
}
