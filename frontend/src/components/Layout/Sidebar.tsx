// frontend/src/components/Layout/Sidebar.tsx

import { LayoutDashboard, Wallet, FileBarChart, TrendingUp, Wand2, BellRing, X, Plus, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: () => void;
}

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/carteira", label: "Minha Carteira", icon: Wallet, end: false },
  { to: "/previsao", label: "Previsão", icon: TrendingUp, end: false },
  { to: "/simulacao", label: "Simulação", icon: Wand2, end: false },
  { to: "/alertas", label: "Alertas", icon: BellRing, end: false },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart, end: false },
];

export function Sidebar({ isOpen, onClose, onAddStock }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {/* Overlay (mobile) */}
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

        {user && (
          <div className={styles.userBlock}>
            <div className={styles.userAvatar}>{user.name.charAt(0).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout} aria-label="Sair da conta">
              <LogOut size={16} />
            </button>
          </div>
        )}

        <div className={styles.footerNote}>AtlasCapital · Gestão de carteira</div>
      </aside>
    </>
  );
}