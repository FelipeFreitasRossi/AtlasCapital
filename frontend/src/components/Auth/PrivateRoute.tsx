// Guarda de rota: só deixa passar para as páginas internas (Dashboard,
// Carteira, Relatórios) quem estiver autenticado. Quem não estiver é
// mandado de volta para o Login, guardando a rota que tentou acessar
// para poder devolver o usuário pra lá depois de entrar.

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PrivateRoute() {
  const { isAuthenticated, isCheckingSession } = useAuth();
  const location = useLocation();

  if (isCheckingSession) {
    // Evita um "flash" da tela de Login enquanto ainda checamos se já
    // existe uma sessão salva no localStorage.
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
