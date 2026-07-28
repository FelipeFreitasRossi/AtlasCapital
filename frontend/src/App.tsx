// frontend/src/App.tsx

import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen/SplashScreen";
import { AppShell } from "./components/Layout/AppShell";
import { StockForm } from "./components/StockForm/StockForm";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { OnboardingGate } from "./components/Auth/OnboardingGate";
import { DashboardPage } from "./pages/DashboardPage";
import { WalletPage } from "./pages/WalletPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ForecastPage } from "./pages/ForecastPage";
import { SimulationPage } from "./pages/SimulationPage";
import { AlertsPage } from "./pages/AlertsPage";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { OnboardingPage } from "./pages/Auth/OnboardingPage";
import { useStocks } from "./hooks/useStocks";
import { useAuth } from "./context/AuthContext";
import { pushToast } from "./components/Toast/toastStore";
import { checkAlerts } from "./services/aiService";
import type { StockWithMetrics } from "./types/stock";

function App() {
  const { stocks, totals, isLoading, error, saveStock, removeStock } = useStocks();
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

  // Fallback: se a Splash não sumir, força após 4s
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  function openCreateForm() { setEditingStock(null); }
  function openEditForm(stock: StockWithMetrics) { setEditingStock(stock); }
  function closeForm() { setEditingStock(undefined); }

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route element={<OnboardingGate />}>
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
              <Route path="previsao" element={<ForecastPage />} />
              <Route path="simulacao" element={<SimulationPage />} />
              <Route path="alertas" element={<AlertsPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      {editingStock !== undefined && (
        <StockForm initialData={editingStock} onCancel={closeForm} onSubmit={handleFormSubmit} />
      )}
    </>
  );
}

export default App;