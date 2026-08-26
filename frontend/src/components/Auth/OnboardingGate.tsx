// frontend/src/components/Auth/OnboardingGate.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useOnboarding } from "../../hooks/useOnboarding";

/**
 * OnboardingGate é um componente de rota que verifica se o usuário já viu o onboarding.
 * Se NÃO viu, redireciona para a página de onboarding.
 * Se JÁ viu, renderiza as rotas filhas (Dashboard, Carteira, etc.).
 */
export function OnboardingGate() {
  const { hasSeenOnboarding } = useOnboarding();

  // Se o usuário ainda não viu o onboarding, redireciona para a página de onboarding
  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Se já viu, renderiza as rotas filhas (Dashboard, Carteira, etc.)
  return <Outlet />;
}