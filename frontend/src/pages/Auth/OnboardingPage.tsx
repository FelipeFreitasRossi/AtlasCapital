// frontend/src/pages/Auth/OnboardingPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LineChart, Wallet, FileBarChart } from "lucide-react";
import styles from "./OnboardingPage.module.css";

const SLIDES = [
  {
    icon: <LineChart size={48} />,
    title: "Acompanhe suas ações",
    description: "Visualize o desempenho da sua carteira com gráficos interativos e métricas atualizadas em tempo real.",
  },
  {
    icon: <Wallet size={48} />,
    title: "Gerencie sua carteira",
    description: "Cadastre suas ações, acompanhe preços de compra e venda, e tenha uma visão completa do seu patrimônio.",
  },
  {
    icon: <FileBarChart size={48} />,
    title: "Exporte relatórios",
    description: "Baixe seus dados em PDF, Excel ou CSV para análises offline e compartilhamento.",
  },
];

export function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Se o usuário já tiver visto, redireciona imediatamente
  useEffect(() => {
    if (user?.id) {
      const key = `atlascapital:onboarding_seen:${user.id}`;
      if (localStorage.getItem(key) === "true") {
        window.location.href = "/";
      }
    }
  }, [user]);

  const handleFinish = () => {
    if (user?.id) {
      localStorage.setItem(`atlascapital:onboarding_seen:${user.id}`, "true");
    }
    window.location.href = "/";
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
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
              onClick={() => setCurrentSlide(index)}
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