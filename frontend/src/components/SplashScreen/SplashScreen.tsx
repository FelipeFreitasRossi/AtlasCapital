// A Splash Screen é a primeira coisa que aparece quando o app abre.
// Ela fica visível por um tempo mínimo (pra não "piscar" rápido demais
// e parecer um bug) E até os dados da carteira terminarem de carregar
// — o que demorar mais entre os dois. Depois disso, ela desaparece com
// um fade suave, revelando o conteúdo principal do app.

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
  isDataLoaded: boolean;
  onFinished: () => void;
}

const MIN_DISPLAY_MS = 2200;

export function SplashScreen({ isDataLoaded, onFinished }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasExitedRef = useRef(false);

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Animação de ENTRADA do logo: some da tela girado e pequeno,
  // depois "revela" no tamanho certo com um leve exagero (back.out),
  // e por fim entra em um pulsar suave e contínuo (respiração).
  useEffect(() => {
    if (!logoRef.current) return;

    const timeline = gsap.timeline();
    timeline
      .fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.5, rotate: -12 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: "back.out(1.7)" },
      )
      .to(logoRef.current, {
        boxShadow: "0 0 40px var(--gold-glow)",
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: "sine.inOut",
      });

    return () => {
      timeline.kill();
    };
  }, []);

  // Barra de progresso: anda sozinha até 90% no tempo mínimo de exibição,
  // e só completa os 10% finais quando os dados realmente chegam.
  useEffect(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      width: "90%",
      duration: MIN_DISPLAY_MS / 1000,
      ease: "power1.inOut",
    });

    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Quando o tempo mínimo já passou E os dados já carregaram, dispara a saída.
  useEffect(() => {
    if (!minTimeElapsed || !isDataLoaded || hasExitedRef.current) return;
    hasExitedRef.current = true;

    if (progressRef.current) {
      gsap.to(progressRef.current, { width: "100%", duration: 0.3, ease: "power1.out" });
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      delay: 0.35,
      ease: "power1.inOut",
      onComplete: onFinished,
    });
  }, [minTimeElapsed, isDataLoaded, onFinished]);

  return (
    <div className={styles.splash} ref={containerRef}>
      <div className={styles.content}>
        <div className={styles.logoRing} ref={logoRef}>
          <span className={styles.logoLetters}>AC</span>
        </div>
        <div>
          <div className={styles.brandName}>AtlasCapital</div>
          <div className={styles.tagline}>Carregando sua carteira...</div>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} ref={progressRef} />
        </div>
      </div>
    </div>
  );
}
