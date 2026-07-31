// frontend/src/pages/Auth/OnboardingPage.tsx

import { useState, useEffect } from "react";
import { useOnboarding } from "../../hooks/useOnboarding";
import { LineChart, Wallet, FileBarChart } from "lucide-react";
import styles from "./OnboardingPage.module.css";

const SLIDES = [
  {
    icon: <LineChart size={48} />,
    title: "Acompanhe suas ações",
    description: "Visualize o desempenho da sua carteira com gráficos interativos e métricas atualizadas em tempo real."
  },
  {
    icon: <Wallet size={48} />,
    title: "Gerencie sua carteira",
    description: "Cadastre suas ações, acompanhe preços de compra e venda, e tenha uma visão completa do seu patrimônio."
  },
  {
    icon: <FileBarChart size={48} />,
    title: "Exporte relatórios",
    description: "Baixe seus dados em PDF, Excel ou CSV para análises offline e compartilhamento."
  }
];

export function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { hasSeenOnboarding, markOnboardingAsSeen } = useOnboarding();

  useEffect(() => {
    if (hasSeenOnboarding) {
      window.location.href = "/";
    }
  }, [hasSeenOnboarding]);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    markOnboardingAsSeen();
    window.location.href = "/";
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const isLastSlide = currentSlide === SLIDES.length - 1;

  if (hasSeenOnboarding) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button className={styles.skipButton} onClick={handleSkip}>
        Pular
      </button>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>{SLIDES[currentSlide].icon}</div>
        <h1 className={styles.title}>{SLIDES[currentSlide].title}</h1>
        <p className={styles.description}>{SLIDES[currentSlide].description}</p>
        <div className={styles.dots}>
          {SLIDES.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${currentSlide === index ? styles.dotActive : ""}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
        <button className={styles.nextButton} onClick={handleNext}>
          {isLastSlide ? "Começar" : "Próximo"}
        </button>
      </div>
    </div>
  );
}