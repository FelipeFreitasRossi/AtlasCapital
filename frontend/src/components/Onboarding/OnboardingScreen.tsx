// Tela de boas-vindas, mostrada apenas na PRIMEIRA vez que o usuário
// entra no app (controlado via localStorage, ver hook
// "useOnboarding.ts"). São 3 slides simples, navegáveis por
// "Próximo"/"Voltar" ou pelas bolinhas de progresso; o último slide
// tem um botão "Começar" que leva ao Dashboard.

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import styles from "./OnboardingScreen.module.css";
import { ONBOARDING_SLIDES } from "./onboardingSlides";

interface OnboardingScreenProps {
  onFinish: () => void;
}

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);

  const isLast = activeIndex === ONBOARDING_SLIDES.length - 1;
  const isFirst = activeIndex === 0;
  const Slide = ONBOARDING_SLIDES[activeIndex];
  const SlideIcon = Slide.icon;

  // Anima a troca de slide: o conteúdo novo entra deslizando da
  // direita (avançar) ou da esquerda (voltar), com um leve fade.
  useEffect(() => {
    if (!slideRef.current) return;
    const animation = gsap.fromTo(
      slideRef.current,
      { opacity: 0, x: directionRef.current * 40 },
      { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
    );
    return () => {
      animation.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  function goNext() {
    if (isLast) {
      onFinish();
      return;
    }
    directionRef.current = 1;
    setActiveIndex((index) => Math.min(index + 1, ONBOARDING_SLIDES.length - 1));
  }

  function goBack() {
    directionRef.current = -1;
    setActiveIndex((index) => Math.max(index - 1, 0));
  }

  function goToSlide(index: number) {
    directionRef.current = index > activeIndex ? 1 : -1;
    setActiveIndex(index);
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <button className={styles.skipButton} onClick={onFinish}>
          Pular
        </button>

        <div className={styles.slide} ref={slideRef}>
          <div className={styles.iconRing}>
            <SlideIcon size={34} />
          </div>
          <h2 className={styles.title}>{Slide.title}</h2>
          <p className={styles.description}>{Slide.description}</p>
        </div>

        <div className={styles.dots} role="tablist" aria-label="Progresso das boas-vindas">
          {ONBOARDING_SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ir para o slide ${index + 1}`}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={goBack}
            disabled={isFirst}
            aria-label="Slide anterior"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>

          <button type="button" className={styles.nextButton} onClick={goNext}>
            {isLast ? (
              <>
                Começar
                <Check size={16} />
              </>
            ) : (
              <>
                Próximo
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
