import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SplashScreen } from "./components/SplashScreen/SplashScreen";
import { AppShell } from "./components/Layout/AppShell";
import { StockForm } from "./components/StockForm/StockForm";
import { DashboardPage } from "./pages/DashboardPage";
import { WalletPage } from "./pages/WalletPage";
import { ReportsPage } from "./pages/ReportsPage";
import { useStocks } from "./hooks/useStocks";
import type { StockWithMetrics } from "./types/stock";

function App() {
  const { stocks, totals, isLoading, error, saveStock, removeStock } = useStocks();

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
    await saveStock(data, editingStock?.id);
    closeForm();
  }

  async function handleDelete(stock: StockWithMetrics) {
    const confirmed = window.confirm(`Apagar a ação ${stock.ticker}? Essa ação não pode ser desfeita.`);
    if (confirmed) {
      await removeStock(stock.id);
    }
  }

  if (showSplash) {
    return <SplashScreen isDataLoaded={!isLoading} onFinished={() => setShowSplash(false)} />;
  }

  return (
    <>
      <Routes>
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
      </Routes>

      {editingStock !== undefined && (
        <StockForm initialData={editingStock} onCancel={closeForm} onSubmit={handleFormSubmit} />
      )}
    </>
  );
}

export default App;