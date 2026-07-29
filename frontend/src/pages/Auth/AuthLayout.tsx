// frontend/src/pages/Auth/AuthLayout.tsx

import type { ReactNode } from "react";
import { LineChart, ShieldCheck, Sparkles, TrendingUp, FileText, Bell } from "lucide-react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const HIGHLIGHTS = [
  { icon: LineChart, text: "Acompanhe o desempenho da sua carteira em tempo real" },
  { icon: TrendingUp, text: "Gráficos interativos com cores por rentabilidade" },
  { icon: FileText, text: "Relatórios exportáveis em PDF, Excel e CSV" },
  { icon: Bell, text: "Alertas personalizados sobre seus investimentos" },
  { icon: ShieldCheck, text: "Seus dados organizados com segurança" },
];

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.panelBrand}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img
              src="https://i.postimg.cc/yWq9jFRD/Atlas-Capital.jpg"
              alt="AtlasCapital"
              className={styles.logoImage}
            />
          </div>
          <span className={styles.brandName}>AtlasCapital</span>
        </div>
        <h1 className={styles.brandTitle}>Sua carteira de investimentos, sob controle.</h1>
        <ul className={styles.highlights}>
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li className={styles.highlightItem} key={text}>
              <span className={styles.highlightIcon}>
                <Icon size={18} />
              </span>
              {text}
            </li>
          ))}
        </ul>
        <div className={styles.brandFooter}>
          <span>Versão 1.0.0</span>
        </div>
      </div>

      <div className={styles.panelForm}>
        <div className={styles.formCard}>
          <div className={styles.mobileBrand}>
            <div className={styles.logo}>
              <img
                src="https://i.postimg.cc/yWq9jFRD/Atlas-Capital.jpg"
                alt="AtlasCapital"
                className={styles.logoImage}
              />
            </div>
            <span className={styles.brandName}>AtlasCapital</span>
          </div>

          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>

          {children}

          <div className={styles.footer}>{footer}</div>
        </div>
      </div>
    </div>
  );
}