// Hook que anima um número "subindo" do zero até o valor final,
// tipo os contadores que sites de investimento usam para mostrar
// o patrimônio "crescendo" na tela assim que ela carrega.
//
// Como funciona: guardamos o valor animado em um "state" (displayValue).
// O GSAP vai, a cada frame, calcular um valor intermediário entre 0 e o
// valor final, e a gente atualiza o state com esse número. O React então
// redesenha o texto na tela com o número mais atual.

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function useCountUp(targetValue: number, durationInSeconds = 1.4) {
  const [displayValue, setDisplayValue] = useState(0);
  // Guardamos um objeto simples só para o GSAP poder "animar" uma
  // propriedade dele (o GSAP precisa de um objeto para tornar isso fácil).
  const counter = useRef({ value: 0 });

  useEffect(() => {
    const tween = gsap.to(counter.current, {
      value: targetValue,
      duration: durationInSeconds,
      ease: "power2.out",
      onUpdate: () => setDisplayValue(counter.current.value),
    });

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue]);

  return displayValue;
}