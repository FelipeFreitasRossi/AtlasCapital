// frontend/src/hooks/useOnboarding.ts

import { useState, useEffect } from "react";

const STORAGE_KEY_PREFIX = "atlascapital:onboarding_seen:";

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Recupera o ID do usuário da sessão
    const session = localStorage.getItem("atlascapital:session");
    let id = null;
    if (session) {
      try {
        const parsed = JSON.parse(session);
        id = parsed.id || parsed.user?.id || null;
      } catch {
        // ignore
      }
    }
    setUserId(id);
    if (id) {
      const seen = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`) === "true";
      setHasSeenOnboarding(seen);
    }
  }, []);

  function markOnboardingAsSeen() {
    // Tenta pegar o userId novamente, caso ainda não tenha sido setado
    const currentUserId = userId || (() => {
      const session = localStorage.getItem("atlascapital:session");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          return parsed.id || parsed.user?.id || null;
        } catch {
          return null;
        }
      }
      return null;
    })();

    if (currentUserId) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${currentUserId}`, "true");
      setHasSeenOnboarding(true);
    } else {
      // Fallback: se não houver userId, marca como visto globalmente (apenas para demo)
      localStorage.setItem("atlascapital:onboarding_seen", "true");
      setHasSeenOnboarding(true);
    }
  }

  return { hasSeenOnboarding, markOnboardingAsSeen };
}