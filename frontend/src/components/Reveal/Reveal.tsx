// "Reveal" é um componente "embrulho" (wrapper): você coloca qualquer
// seção da tela dentro dele, e ele cuida de fazer ela aparecer com uma
// animação de fade + deslize assim que o usuário rola a página até ali.
//
// A ideia de deixar isso em um componente separado é reaproveitar a
// mesma animação em várias seções (StatsCards, Dashboard, StockTable,
// ExportButtons) sem repetir a configuração do GSAP em cada uma.

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealDirection = "up" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
}

// Define de onde a seção "vem" antes de se acomodar no lugar final
function getStartPosition(direction: RevealDirection) {
  switch (direction) {
    case "left":
      return { x: -40, y: 0 };
    case "right":
      return { x: 40, y: 0 };
    case "up":
    default:
      return { x: 0, y: 48 };
  }
}

export function Reveal({ children, direction = "up", delay = 0, className }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const start = getStartPosition(direction);

    const animation = gsap.fromTo(
      element,
      { opacity: 0, x: start.x, y: start.y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%", // dispara quando o topo do elemento chega a 85% da tela
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [direction, delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}