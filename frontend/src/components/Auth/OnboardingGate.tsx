import { Navigate, Outlet } from "react-router-dom";
import { useOnboarding } from "../../hooks/useOnboarding";

export function OnboardingGate() {
  const { hasSeenOnboarding } = useOnboarding();

  console.log('[OnboardingGate] hasSeenOnboarding =', hasSeenOnboarding);

  if (!hasSeenOnboarding) {
    console.log('[OnboardingGate] Redirecionando para /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  console.log('[OnboardingGate] Permitindo acesso à rota protegida');
  return <Outlet />;
}