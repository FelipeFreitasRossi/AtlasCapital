// frontend/src/App.tsx

import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen/SplashScreen";
import { AppShell } from "./components/Layout/AppShell";
import { PublicLayout } from "./components/Layout/PublicLayout";
import { StockForm } from "./components/StockForm/StockForm";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { OnboardingGate } from "./components/Auth/OnboardingGate";
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

function App() {
  const { stocks, totals, isLoading, error, saveStock, removeStock, refreshPrices } = useStocks();
  const { isAuthenticated, isCheckingSession } = useAuth();

  // LOGS PARA DEPURAÇÃO
  console.log('[App] isLoading:', isLoading, 'isCheckingSession:', isCheckingSession);

  // Verificação periódica de alertas
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

  // Se a SplashScreen ainda estiver visível, renderiza ela
  if (showSplash) {
    return (
      <SplashScreen
        isDataLoaded={!isLoading && !isCheckingSession}
        onFinished={() => {
          console.log('[App] SplashScreen finalizada');
          setShowSplash(false);
        }}
      />
    );
  }

  // Se a SplashScreen já foi finalizada, renderiza o app normalmente
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/documentacao" element={<DocumentacaoPage />} />
        </Route>

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
                    refreshPrices,
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
      <CalendarModal />
    </>
  );
}

export default App;