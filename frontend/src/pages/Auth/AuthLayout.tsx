import type { ReactNode } from "react";
import { LineChart, ShieldCheck, Sparkles } from "lucide-react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const HIGHLIGHTS = [
  { icon: LineChart, text: "Acompanhe o desempenho da sua carteira em tempo real" },
  { icon: Sparkles, text: "Relatórios exportáveis em PDF, Excel e CSV" },
  { icon: ShieldCheck, text: "Seus dados de carteira, organizados com segurança" },
];

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.panelBrand}>
        <div className={styles.brand}>
          <div className={styles.logo}>AC</div>
          <span className={styles.brandName}>AtlasCapital</span>
        </div>
        <h1 className={styles.brandTitle}>Sua carteira de investimentos, sob controle.</h1>
        <ul className={styles.highlights}>
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li className={styles.highlightItem} key={text}>
              <span className={styles.highlightIcon}>
                <Icon size={16} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.panelForm}>
        <div className={styles.formCard}>
          <div className={styles.mobileBrand}>
            <div className={styles.logo}>AC</div>
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
