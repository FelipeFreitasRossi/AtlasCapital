// frontend/src/components/Auth/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isCheckingSession } = useAuth();

  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated, 'isCheckingSession:', isCheckingSession);

  // Se ainda está verificando, mostra um loading (mas não redireciona)
  if (isCheckingSession) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
      Verificando autenticação...
    </div>;
  }

  // Se não está autenticado, redireciona
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Redirecionando para login (não autenticado)');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}