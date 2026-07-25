// Menu de navegação do app. No desktop, ele fica sempre visível como
// uma coluna fixa à esquerda. No mobile, ele vira uma "gaveta" (drawer)
// que desliza da esquerda quando o usuário toca no botão de menu (☰).
//
// Usamos o componente "NavLink" do React Router: ele já sabe sozinho
// qual link está "ativo" (comparando com a URL atual), então a gente só
// precisa estilizar o estado ativo — sem escrever essa lógica na mão.

import { LayoutDashboard, Wallet, FileBarChart, X, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: () => void;
}

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/carteira", label: "Minha Carteira", icon: Wallet, end: false },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart, end: false },
];

export function Sidebar({ isOpen, onClose, onAddStock }: SidebarProps) {
  return (
    <>
      {/* No mobile, um fundo escurecido atrás da gaveta, que fecha o menu ao ser tocado */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>AC</div>
          <span className={styles.brandText}>AtlasCapital</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.spacer} />

        <button className={styles.addButton} onClick={onAddStock}>
          <Plus size={18} />
          Nova Ação
        </button>

        <div className={styles.footerNote}>AtlasCapital · Gestão de carteira</div>
      </aside>
    </>
  );
}