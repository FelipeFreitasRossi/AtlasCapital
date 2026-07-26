// Uma linha fininha no topo da tela que cresce da esquerda pra direita
// conforme o usuário rola a página — dá pra "sentir" quanto falta de
// conteúdo ali embaixo. Atualizamos com um scroll listener simples;
// como é só uma barra, não precisamos de GSAP aqui.

import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateProgress() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      if (fillRef.current) {
        fillRef.current.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className={styles.track}>
      <div className={styles.fill} ref={fillRef} />
    </div>
  );
}
