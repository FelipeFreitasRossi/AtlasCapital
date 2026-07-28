// frontend/src/components/SplashScreen/SplashScreen.tsx

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

  // Animação de entrada do logo
  useEffect(() => {
    if (!logoRef.current) return;

    const timeline = gsap.timeline();
    timeline
      .fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.5, rotate: -12 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: "back.out(1.7)" }
      )
      .to(logoRef.current, {
        boxShadow: "0 0 40px rgba(212, 175, 55, 0.3)",
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: "sine.inOut",
      });

    return () => {
      timeline.kill();
    };
  }, []);

  // Barra de progresso
  useEffect(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      width: "90%",
      duration: MIN_DISPLAY_MS / 1000,
      ease: "power1.inOut",
      onComplete: () => setMinTimeElapsed(true),
    });

    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS + 200);
    return () => clearTimeout(timer);
  }, []);

  // Quando o tempo mínimo passou E os dados carregaram, dispara a saída
  useEffect(() => {
    if (minTimeElapsed && isDataLoaded && !hasExitedRef.current) {
      handleFinish();
    }
  }, [minTimeElapsed, isDataLoaded]);

  // Fallback de segurança: se depois de 5 segundos ainda não saiu, força saída
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasExitedRef.current) {
        handleFinish();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    if (hasExitedRef.current) return;
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
  };

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