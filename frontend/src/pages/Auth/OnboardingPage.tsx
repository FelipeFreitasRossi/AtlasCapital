// frontend/src/pages/Auth/OnboardingPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { markOnboardingAsSeen } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Marca como visto
    markOnboardingAsSeen();
    
    // Navega para o Dashboard (força a navegação)
    navigate("/", { replace: true });
    
    // Fallback: se a navegação falhar, recarrega a página
    setTimeout(() => {
      if (window.location.pathname === "/onboarding") {
        window.location.href = "/";
      }
    }, 300);
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const isLastSlide = currentSlide === SLIDES.length - 1;

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