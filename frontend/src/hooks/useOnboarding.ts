import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY_PREFIX = 'atlascapital:onboarding_seen:';

export function useOnboarding() {
  const { user, isAuthenticated } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    console.log('[useOnboarding] useEffect: isAuthenticated=', isAuthenticated, 'user=', user);
    if (!isAuthenticated || !user?.id) {
      console.log('[useOnboarding] Usuário não autenticado ou sem ID. Setando hasSeenOnboarding = false');
      setHasSeenOnboarding(false);
      return;
    }
    const key = `${STORAGE_KEY_PREFIX}${user.id}`;
    const seen = localStorage.getItem(key) === 'true';
    console.log(`[useOnboarding] Chave "${key}" = ${seen}`);
    setHasSeenOnboarding(seen);
  }, [isAuthenticated, user]);

  function markOnboardingAsSeen() {
    console.log('[useOnboarding] markOnboardingAsSeen chamado');
    if (!user?.id) {
      console.log('[useOnboarding] Sem userId, usando fallback global');
      localStorage.setItem('atlascapital:onboarding_seen', 'true');
      setHasSeenOnboarding(true);
      return;
    }
    const key = `${STORAGE_KEY_PREFIX}${user.id}`;
    localStorage.setItem(key, 'true');
    console.log(`[useOnboarding] Chave "${key}" definida como "true"`);
    setHasSeenOnboarding(true);
  }

  return { hasSeenOnboarding, markOnboardingAsSeen };
}