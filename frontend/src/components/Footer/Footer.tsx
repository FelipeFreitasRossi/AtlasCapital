// frontend/src/components/Footer/Footer.tsx

import { FolderGit2, BookOpen, Info, Code2 } from "lucide-react";
import styles from "./Footer.module.css";

const TECHNOLOGIES = ["React", "TypeScript", "Vite", "Node.js", "MongoDB", "Python (FastAPI)"];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandColumn}>
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
          <p className={styles.tagline}>
            Gestão simples e visual da sua carteira de ações, do cadastro ao relatório.
          </p>
        </div>

        <div className={styles.linksColumn}>
          <div className={styles.columnTitle}>Links úteis</div>
          <a className={styles.link} href="#sobre">
            <Info size={14} />
            Sobre
          </a>
          <a className={styles.link} href="#documentacao">
            <BookOpen size={14} />
            Documentação
          </a>
          <a
            className={styles.link}
            href="https://github.com/atlascapital/atlascapital"
            target="_blank"
            rel="noreferrer"
          >
            <FolderGit2 size={14} />
            GitHub
          </a>
        </div>

        <div className={styles.techColumn}>
          <div className={styles.columnTitle}>Construído com</div>
          <div className={styles.techList}>
            {TECHNOLOGIES.map((tech) => (
              <span className={styles.techBadge} key={tech}>
                <Code2 size={12} />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© {currentYear} AtlasCapital. Todos os direitos reservados.</span>
        <span>Feito com dedicação para investidores organizados.</span>
      </div>
    </footer>
  );
}