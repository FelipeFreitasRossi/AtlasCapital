// frontend/src/pages/Sobre/SobrePage.tsx

import { PageHeader } from "../../components/PageHeader/PageHeader";
import { Reveal } from "../../components/Reveal/Reveal";
import {
  Target,
  BarChart,
  FileText,
  Bell,
  TrendingUp,
  Layers,
  Code2,
} from "lucide-react";
import styles from "./SobrePage.module.css";
import { FolderGit2 } from "lucide-react";

export function SobrePage() {
  return (
    <div>
      <PageHeader
        title="Sobre o AtlasCapital"
        subtitle="Conheça a história e a missão do nosso projeto"
      />

      <Reveal delay={0}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            <Target size={20} className={styles.icon} />
            Nossa Missão
          </h2>
          <p className={styles.text}>
            O AtlasCapital nasceu com o objetivo de democratizar o acesso a ferramentas
            de gestão de investimentos, oferecendo uma plataforma simples, intuitiva e
            poderosa para investidores de todos os níveis.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            <Layers size={20} className={styles.icon} />
            O que oferecemos
          </h2>
          <ul className={styles.list}>
            <li>
              <BarChart size={18} className={styles.listIcon} />
              <strong>Dashboard interativo</strong> – visualize o desempenho da sua carteira em tempo real.
            </li>
            <li>
              <TrendingUp size={18} className={styles.listIcon} />
              <strong>Gráficos intuitivos</strong> – acompanhe lucros e prejuízos de cada ação com cores diferenciadas.
            </li>
            <li>
              <FileText size={18} className={styles.listIcon} />
              <strong>Exportação de relatórios</strong> – baixe seus dados em PDF, Excel ou CSV.
            </li>
            <li>
              <Bell size={18} className={styles.listIcon} />
              <strong>Alertas personalizados</strong> – seja notificado sobre movimentos importantes da sua carteira.
            </li>
            <li>
              <TrendingUp size={18} className={styles.listIcon} />
              <strong>Simulações e previsões</strong> – tome decisões mais informadas com nossas ferramentas de análise.
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            <Code2 size={20} className={styles.icon} />
            Tecnologias utilizadas
          </h2>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <span className={styles.techName}>Frontend</span>
              <span className={styles.techDesc}>React, TypeScript, Vite, GSAP</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Backend (API)</span>
              <span className={styles.techDesc}>Node.js, Express, TypeScript</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Backend (IA)</span>
              <span className={styles.techDesc}>Python, FastAPI</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Banco de Dados</span>
              <span className={styles.techDesc}>MongoDB</span>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.24}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            <FolderGit2 size={20} className={styles.icon} />
            Contribua com o projeto
          </h2>
          <p className={styles.text}>
            O AtlasCapital é um projeto open-source. Se você deseja contribuir, reportar
            um problema ou sugerir uma melhoria, visite nosso repositório no GitHub:
          </p>
          <a
            href="https://github.com/FelipeFreitasRossi/AtlasCapital"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <FolderGit2 size={16} />
            github.com/FelipeFreitasRossi/AtlasCapital
          </a>
        </div>
      </Reveal>
    </div>
  );
}