// frontend/src/pages/WalletPage.tsx

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import pageStyles from "./Page.module.css";
import filterStyles from "./WalletFilters.module.css";
import { StockTable } from "../components/StockTable/StockTable";
import { Reveal } from "../components/Reveal/Reveal";
import { useWalletContext } from "../components/Layout/AppShell";
import { DateField } from "../components/DateField/DateField";

export function WalletPage() {
  const { stocks, isLoading, error, openEditForm, handleDelete } = useWalletContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFrom = dateFrom === "" || stock.purchaseDate >= dateFrom;
      const matchesTo = dateTo === "" || stock.purchaseDate <= dateTo;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [stocks, searchTerm, dateFrom, dateTo]);

  const hasActiveFilters = searchTerm !== "" || dateFrom !== "" || dateTo !== "";

  function clearFilters() {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
  }

  function clearSearch() {
    setSearchTerm("");
  }

  if (isLoading) {
    return <div className={pageStyles.loadingState}>Carregando sua carteira...</div>;
  }

  if (error) {
    return <div className={pageStyles.errorState}>{error}</div>;
  }

  return (
    <div>
      <div className={pageStyles.pageHeader}>
        <div className={pageStyles.pageTitle}>Minha Carteira</div>
        <div className={pageStyles.pageSubtitle}>
          {filteredStocks.length} de {stocks.length}{" "}
          {stocks.length === 1 ? "ação cadastrada" : "ações cadastradas"}
        </div>
      </div>

      <Reveal>
        <div className={filterStyles.filters}>
          <div className={filterStyles.field}>
            <label className={filterStyles.label} htmlFor="search">
              Ticker ou empresa
            </label>
            <div className={filterStyles.searchWrapper}>
              <Search size={16} className={filterStyles.searchIcon} />
              <input
                id="search"
                className={filterStyles.input}
                placeholder="Ex: PETR4 ou Petrobras"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className={filterStyles.clearSearch}
                  onClick={clearSearch}
                  aria-label="Limpar busca"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className={filterStyles.field}>
            <label className={filterStyles.label} htmlFor="dateFrom">
              Comprado a partir de
            </label>
            <DateField
              id="dateFrom"
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="Data inicial"
            />
          </div>

          <div className={filterStyles.field}>
            <label className={filterStyles.label} htmlFor="dateTo">
              Comprado até
            </label>
            <DateField
              id="dateTo"
              value={dateTo}
              onChange={setDateTo}
              placeholder="Data final"
            />
          </div>

          {hasActiveFilters && (
            <button className={filterStyles.clearButton} onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <StockTable
          stocks={filteredStocks}
          onEdit={openEditForm}
          onDelete={handleDelete}
          title="Ações da carteira"
        />
      </Reveal>
    </div>
  );
}