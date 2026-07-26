// Página com a visão completa da carteira: filtros por ticker/nome e
// por período de compra, além da tabela (que já sabe se ordenar
// sozinha ao clicar nos cabeçalhos, veja StockTable.tsx).
//
// Importante: filtrar e ordenar são coisas diferentes.
// - FILTRAR (feito aqui nesta página) decide QUAIS linhas aparecem.
// - ORDENAR (feito dentro do StockTable) decide a ORDEM das linhas
//   que já passaram pelo filtro.

import { useMemo, useState } from "react";
import pageStyles from "./Page.module.css";
import filterStyles from "./WalletFilters.module.css";
import { StockTable } from "../components/StockTable/StockTable";
import { Reveal } from "../components/Reveal/Reveal";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { useWalletContext } from "../components/Layout/AppShell";

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

  if (isLoading) {
    return <div className={pageStyles.loadingState}>Carregando sua carteira...</div>;
  }

  if (error) {
    return <div className={pageStyles.errorState}>{error}</div>;
  }

  return (
    <div>
      <PageHeader
        title="Minha Carteira"
        subtitle={`${filteredStocks.length} de ${stocks.length} ${
          stocks.length === 1 ? "ação cadastrada" : "ações cadastradas"
        }`}
      />

      <Reveal delay={0}>
        <div className={filterStyles.filters}>
          <div className={filterStyles.field}>
            <label className={filterStyles.label} htmlFor="search">
              Ticker ou empresa
            </label>
            <input
              id="search"
              className={filterStyles.input}
              placeholder="Ex: PETR4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={filterStyles.field}>
            <label className={filterStyles.label} htmlFor="dateFrom">
              Comprado a partir de
            </label>
            <input
              id="dateFrom"
              type="date"
              className={filterStyles.input}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className={filterStyles.field}>
            <label className={filterStyles.label} htmlFor="dateTo">
              Comprado até
            </label>
            <input
              id="dateTo"
              type="date"
              className={filterStyles.input}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button className={filterStyles.clearButton} onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.12}>
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
