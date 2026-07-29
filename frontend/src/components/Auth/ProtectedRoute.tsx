import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isCheckingSession } = useAuth();

  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated, 'isCheckingSession:', isCheckingSession);

  if (isCheckingSession) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Verificando autenticação...</div>;
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Redirecionando para login (não autenticado)');
    return <Navigate to="/login" replace />;
  }

  console.log('[ProtectedRoute] Autenticado, renderizando página');
  return <Outlet />;
}