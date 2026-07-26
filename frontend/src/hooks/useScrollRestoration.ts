// Sem isso, toda vez que o usuário troca de página, o navegador some
// pro topo — o que é bom na primeira visita, mas ruim se ele já tinha
// rolado a "Minha Carteira" até a metade, foi no Dashboard e voltou:
// ele esperaria continuar de onde parou.
//
// A solução: guardamos, num "mapa" que sobrevive entre as trocas de
// página (usando useRef fora do componente, no módulo), a posição de
// scroll de cada rota. Quando o usuário SAI de uma rota, salvamos a
// posição atual. Quando ele ENTRA numa rota, restauramos a posição
// salva (ou vamos para o topo, se for a primeira visita).

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map<string, number>();

export function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = scrollPositions.get(location.pathname) ?? 0;

    // Pequeno atraso para deixar o conteúdo da nova página renderizar
    // antes de tentar rolar até a posição salva.
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: savedPosition, behavior: "auto" });
    });

    return () => {
      cancelAnimationFrame(frame);
      scrollPositions.set(location.pathname, window.scrollY);
    };
  }, [location.pathname]);
}
