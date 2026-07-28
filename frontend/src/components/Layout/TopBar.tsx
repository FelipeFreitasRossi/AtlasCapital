// frontend/src/components/Layout/TopBar.tsx

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
        <div className={styles.logo} style={{ width: 32, height: 32 }}>
          <img
            src="https://i.postimg.cc/yWq9jFRD/Atlas-Capital.jpg"
            alt="AtlasCapital"
            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 6 }}
          />
        </div>
        AtlasCapital
      </div>
      <button className={styles.menuButton} onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
    </header>
  );
}