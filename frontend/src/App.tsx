import { useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen/SplashScreen";
import { AppShell } from "./components/Layout/AppShell";
import { StockForm } from "./components/StockForm/StockForm";
import { OnboardingScreen } from "./components/Onboarding/OnboardingScreen";
import { PrivateRoute } from "./components/Auth/PrivateRoute";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { WalletPage } from "./pages/WalletPage";
import { ReportsPage } from "./pages/ReportsPage";
import { useStocks } from "./hooks/useStocks";
import { useOnboarding } from "./hooks/useOnboarding";
import { useAuth } from "./context/AuthContext";
import { pushToast } from "./components/Toast/toastStore";
import type { StockWithMetrics } from "./types/stock";
import type { ReactNode } from "react";

// Impede que quem já está logado veja as telas de Login/Cadastro de
// novo (ex: digitando a URL /login manualmente) — manda direto pro app.
function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isCheckingSession } = useAuth();
  if (isCheckingSession) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const { stocks, totals, isLoading, error, saveStock, removeStock } = useStocks();
  const { user, isCheckingSession } = useAuth();
  const { hasSeenOnboarding, markOnboardingSeen } = useOnboarding(user?.id ?? null);

  // Controla se a Splash Screen ainda deve ser exibida
  const [showSplash, setShowSplash] = useState(true);

  // Guarda se o modal está aberto e, se estiver editando, QUAL ação.
  // "undefined" = modal fechado. "null" = modal aberto para CRIAR.
  // "StockWithMetrics" = modal aberto para EDITAR aquela ação.
  const [editingStock, setEditingStock] = useState<StockWithMetrics | null | undefined>(undefined);

  function openCreateForm() {
    setEditingStock(null);
  }

  function openEditForm(stock: StockWithMetrics) {
    setEditingStock(stock);
  }

  function closeForm() {
    setEditingStock(undefined);
  }

  async function handleFormSubmit(data: Parameters<typeof saveStock>[0]) {
    const isEditing = Boolean(editingStock?.id);
    try {
      await saveStock(data, editingStock?.id);
      closeForm();
      pushToast(isEditing ? "Ação atualizada com sucesso!" : "Ação cadastrada com sucesso!", "success");
    } catch {
      pushToast("Não foi possível salvar a ação. Tente novamente.", "error");
    }
  }

  async function handleDelete(stock: StockWithMetrics) {
    const confirmed = window.confirm(`Apagar a ação ${stock.ticker}? Essa ação não pode ser desfeita.`);
    if (confirmed) {
      try {
        await removeStock(stock.id);
        pushToast(`${stock.ticker} removida da carteira.`, "info");
      } catch {
        pushToast("Não foi possível apagar a ação. Tente novamente.", "error");
      }
    }
  }

  // A Splash fica visível até os dados carregarem E até sabermos se
  // já existe uma sessão salva (evita "piscar" a tela de Login).
  if (showSplash) {
    return (
      <SplashScreen
        isDataLoaded={!isLoading && !isCheckingSession}
        onFinished={() => setShowSplash(false)}
      />
    );
  }

  // Usuário logado, mas ainda não viu a tela de boas-vindas.
  if (user && !hasSeenOnboarding) {
    return <OnboardingScreen onFinish={markOnboardingSeen} />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route element={<PrivateRoute />}>
          <Route
            element={
              <AppShell
                context={{
                  stocks,
                  totals,
                  isLoading,
                  error,
                  openCreateForm,
                  openEditForm,
                  handleDelete,
                }}
              />
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="carteira" element={<WalletPage />} />
            <Route path="relatorios" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {editingStock !== undefined && (
        <StockForm initialData={editingStock} onCancel={closeForm} onSubmit={handleFormSubmit} />
      )}
    </>
  );
}

export default App;
