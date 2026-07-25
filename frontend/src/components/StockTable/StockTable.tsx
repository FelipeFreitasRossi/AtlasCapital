// Mostra a tabela com todas as ações cadastradas. Este componente
// não sabe COMO editar ou apagar uma ação — ele só "avisa" o
// componente pai quando o usuário clica em algum botão, através das
// funções "onEdit" e "onDelete" recebidas por props.
//
// Novidade desta versão: os cabeçalhos da tabela são clicáveis e
// ordenam a lista (crescente / decrescente). Quem decide QUAIS ações
// aparecem (filtro por ticker, por data, etc.) é o componente pai
// (a página "Minha Carteira") — este componente só cuida de mostrar e
// ordenar o que recebeu.

import { Fragment, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./StockTable.module.css";
import type { StockWithMetrics } from "../../types/stock";

interface StockTableProps {
  stocks: StockWithMetrics[];
  onEdit: (stock: StockWithMetrics) => void;
  onDelete: (stock: StockWithMetrics) => void;
  title?: string;
}

type SortField = "ticker" | "quantity" | "buyPrice" | "currentPrice" | "purchaseDate" | "profitLoss";
type SortDirection = "asc" | "desc";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

const COLUMNS: { field: SortField; label: string; numeric?: boolean }[] = [
  { field: "ticker", label: "Ticker" },
  { field: "quantity", label: "Quantidade", numeric: true },
  { field: "buyPrice", label: "Preço compra", numeric: true },
  { field: "currentPrice", label: "Preço atual", numeric: true },
  { field: "purchaseDate", label: "Data da compra" },
  { field: "profitLoss", label: "Resultado", numeric: true },
];

export function StockTable({ stocks, onEdit, onDelete, title = "Minhas ações" }: StockTableProps) {
  const [sortField, setSortField] = useState<SortField>("ticker");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const sortedStocks = useMemo(() => {
    const copy = [...stocks];
    copy.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      const comparison =
        typeof valueA === "string" ? valueA.localeCompare(valueB as string) : (valueA as number) - (valueB as number);
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [stocks, sortField, sortDirection]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
      </div>

      {stocks.length === 0 ? (
        <div className={styles.emptyState}>
          Nenhuma ação encontrada. Ajuste os filtros ou clique em "+ Nova Ação" para começar.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {COLUMNS.map(({ field, label, numeric }, index) => (
                  <Fragment key={field}>
                    <th
                      className={`${styles.sortableHeader} ${numeric ? styles.numeric : ""}`}
                      onClick={() => handleSort(field)}
                    >
                      {label}
                      {sortField === field &&
                        (sortDirection === "asc" ? (
                          <ChevronUp size={12} style={{ verticalAlign: "middle", marginLeft: 2 }} />
                        ) : (
                          <ChevronDown size={12} style={{ verticalAlign: "middle", marginLeft: 2 }} />
                        ))}
                    </th>
                    {index === 0 && <th>Empresa</th>}
                  </Fragment>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks.map((stock) => {
                const isPositive = stock.profitLoss >= 0;
                return (
                  <tr key={stock.id}>
                    <td className={styles.ticker}>{stock.ticker}</td>
                    <td className={styles.name}>{stock.name}</td>
                    <td className={styles.numeric}>{stock.quantity}</td>
                    <td className={styles.numeric}>{formatCurrency(stock.buyPrice)}</td>
                    <td className={styles.numeric}>{formatCurrency(stock.currentPrice)}</td>
                    <td>{formatDate(stock.purchaseDate)}</td>
                    <td className={styles.numeric}>
                      <span className={`${styles.badge} ${isPositive ? styles.badgePositive : styles.badgeNegative}`}>
                        {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {formatCurrency(stock.profitLoss)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionButton} onClick={() => onEdit(stock)}>
                          Editar
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => onDelete(stock)}
                        >
                          Apagar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}