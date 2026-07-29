import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Footer } from "../Footer/Footer";
import { ScrollProgress } from "../ScrollProgress/ScrollProgress";
import styles from "./AppShell.module.css";

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <ScrollProgress />
      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAddStock={() => {}}
        showAddButton={false}
        showUser={false}
      />

      <div className={styles.mainColumn}>
        <TopBar onOpenMenu={() => setIsMenuOpen(true)} />

        <main className={styles.content}>
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}