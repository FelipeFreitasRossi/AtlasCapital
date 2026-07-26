// Cabeçalho usado no topo de cada página (título + subtítulo). Tem um
// efeito de "parallax" bem discreto: enquanto o usuário rola a página
// para baixo, o cabeçalho se move um pouco mais devagar que o resto
// do conteúdo (e fica levemente mais transparente), dando uma sensação
// sutil de profundidade — sem atrapalhar a leitura.

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./PageHeader.module.css";

gsap.registerPlugin(ScrollTrigger);

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const animation = gsap.to(headerRef.current, {
      y: 28,
      opacity: 0.6,
      ease: "none",
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <div className={styles.header} ref={headerRef}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
}
