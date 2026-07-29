// frontend/src/App.tsx

import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen/SplashScreen";
import { AppShell } from "./components/Layout/AppShell";
import { StockForm } from "./components/StockForm/StockForm";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { WalletPage } from "./pages/WalletPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ForecastPage } from "./pages/ForecastPage";
import { SimulationPage } from "./pages/SimulationPage";
import { AlertsPage } from "./pages/AlertsPage";
import { SobrePage } from "./pages/Sobre/SobrePage";
import { DocumentacaoPage } from "./pages/Documentacao/DocumentacaoPage";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { OnboardingPage } from "./pages/Auth/OnboardingPage";
import { CalendarModal } from "./components/CalendarModal/CalendarModal";
import { useStocks } from "./hooks/useStocks";
import { useAuth } from "./context/AuthContext";
import { pushToast } from "./components/Toast/toastStore";
import { checkAlerts } from "./services/aiService";
import type { StockWithMetrics } from "./types/stock";

// Componente que verifica se o onboarding já foi visto
function OnboardingGuard({ children }: { children: JSX.Element }) {
  const { user, isAuthenticated } = useAuth();
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const key = `atlascapital:onboarding_seen:${user.id}`;
      const seen = localStorage.getItem(key) === "true";
      setHasSeen(seen);
    } else {
      setHasSeen(null);
    }
  }, [isAuthenticated, user]);

  if (hasSeen === null) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Verificando...</div>;
  }

  if (!hasSeen) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function App() {
  const { stocks, totals, isLoading, error, saveStock, removeStock, refreshPrices } = useStocks();
  const { isAuthenticated, isCheckingSession } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || stocks.length === 0) return;
    const interval = setInterval(async () => {
      try {
        const response = await checkAlerts(stocks, totals.currentValue);
        response.newlyTriggered.forEach((alert) => {
          pushToast(alert.message ?? "Um alerta foi disparado!", "success");
        });
      } catch {
        // silencioso
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [isAuthenticated, stocks, totals.currentValue]);

  const [showSplash, setShowSplash] = useState(true);
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
    const confirmed = window.confirm(`Apagar a ação ${stock.ticker}?`);
    if (confirmed) {
      try {
        await removeStock(stock.id);
        pushToast(`${stock.ticker} removida da carteira.`, "info");
      } catch {
        pushToast("Não foi possível apagar a ação.", "error");
      }
    }
  }

  if (showSplash) {
    return (
      <SplashScreen
        isDataLoaded={!isLoading && !isCheckingSession}
        onFinished={() => setShowSplash(false)}
      />
    );
  }

  return (
    <>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/documentacao" element={<DocumentacaoPage />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Aplica o guard de onboarding nas rotas principais */}
          <Route
            element={
              <OnboardingGuard>
                <AppShell
                  context={{
                    stocks,
                    totals,
                    isLoading,
                    error,
                    openCreateForm,
                    openEditForm,
                    handleDelete,
                    refreshPrices,
                  }}
                />
              </OnboardingGuard>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="carteira" element={<WalletPage />} />
            <Route path="previsao" element={<ForecastPage />} />
            <Route path="simulacao" element={<SimulationPage />} />
            <Route path="alertas" element={<AlertsPage />} />
            <Route path="relatorios" element={<ReportsPage />} />
          </Route>
        </Route>
      </Routes>

      {editingStock !== undefined && (
        <StockForm initialData={editingStock} onCancel={closeForm} onSubmit={handleFormSubmit} />
      )}
      <CalendarModal />
    </>
  );
}

export default App;