import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function OnboardingGate() {
  const { hasSeenOnboarding } = useAuth();

  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}