// Controla se a tela de boas-vindas (Onboarding) já foi vista pelo
// usuário. Guardamos essa informação no localStorage, associada ao
// usuário logado — assim, se duas pessoas usarem o mesmo navegador,
// cada uma vê o onboarding na sua própria primeira vez.

import { useCallback, useState } from "react";

const STORAGE_PREFIX = "atlascapital:onboarding_seen:";

function storageKey(userId: string | null): string {
  return `${STORAGE_PREFIX}${userId ?? "guest"}`;
}

export function useOnboarding(userId: string | null) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey(userId)) === "true";
    } catch {
      return true;
    }
  });

  const markOnboardingSeen = useCallback(() => {
    try {
      localStorage.setItem(storageKey(userId), "true");
    } catch {
      // Se o localStorage não estiver disponível, apenas seguimos em
      // frente sem persistir — o pior caso é o onboarding aparecer
      // de novo na próxima visita.
    }
    setHasSeenOnboarding(true);
  }, [userId]);

  return { hasSeenOnboarding, markOnboardingSeen };
}
