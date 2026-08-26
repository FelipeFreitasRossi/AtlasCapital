// frontend/src/components/SplashScreen/SplashScreen.tsx

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
  isDataLoaded: boolean;
  onFinished: () => void;
}

const MIN_DISPLAY_MS = 1500;

export function SplashScreen({ isDataLoaded, onFinished }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hasFinishedRef = useRef(false);

  // Animação do logo (com cleanup corrigida)
  useEffect(() => {
    if (!logoRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );
    return () => {
      tl.kill(); // ✅ agora retorna void
    };
  }, []);

  // Barra de progresso + tempo mínimo
  useEffect(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, {
      width: "100%",
      duration: MIN_DISPLAY_MS / 1000,
      ease: "power1.inOut",
      onComplete: () => setMinTimeElapsed(true),
    });
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS + 200);
    return () => clearTimeout(timer);
  }, []);

  // Quando os dados carregarem E o tempo mínimo tiver passado, finaliza
  useEffect(() => {
    if (minTimeElapsed && isDataLoaded && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          onComplete: onFinished,
        });
      }, 300);
    }
  }, [minTimeElapsed, isDataLoaded, onFinished]);

  // Fallback de segurança: se depois de 5 segundos ainda não tiver finalizado, força
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasFinishedRef.current) {
        console.warn("[SplashScreen] Fallback: forçando finalização após 5s");
        hasFinishedRef.current = true;
        onFinished();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className={styles.splash} ref={containerRef}>
      <div className={styles.content}>
        <div className={styles.logoRing} ref={logoRef}>
          <img
            src="https://i.postimg.cc/yWq9jFRD/Atlas-Capital.jpg"
            alt="AtlasCapital"
            className={styles.logoImage}
          />
        </div>
        <div className={styles.brandName}>AtlasCapital</div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} ref={progressRef} />
        </div>
      </div>
    </div>
  );
}