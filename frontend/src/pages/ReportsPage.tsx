// frontend/src/pages/ReportsPage.tsx

import pageStyles from "./Page.module.css";
import { ExportButtons } from "../components/ExportButtons/ExportButtons";
import { Reveal } from "../components/Reveal/Reveal";
import { useWalletContext } from "../components/Layout/AppShell";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Estilos inline com tipagem correta
const styles: Record<string, React.CSSProperties> = {
  previewCard: {
    background: "linear-gradient(160deg, var(--bg-elevated), var(--bg-surface))",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-card)",
    overflow: "hidden",
  },
  previewHeader: {
    padding: "20px 22px 6px",
    fontFamily: "var(--font-display)",
    fontSize: "15px",
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  previewHint: {
    padding: "0 22px 16px",
    fontSize: "13px",
    color: "var(--text-secondary)",
  },
  tableWrapper: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "0 4px 4px 4px",
  },
  table: {
    width: "100%",
    minWidth: "640px",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    textAlign: "left",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    padding: "12px 16px",
    borderBottom: "1px solid var(--border-subtle)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 16px",
    borderBottom: "1px solid var(--border-subtle)",
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
  },
  numeric: {
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  tickerCell: {
    fontWeight: "600",
    color: "var(--gold-400)",
  },
  positive: {
    color: "var(--green-400)",
  },
  negative: {
    color: "var(--red-400)",
  },
  emptyState: {
    padding: "20px 22px 24px",
    fontSize: "13px",
    color: "var(--text-secondary)",
    textAlign: "center",
  },
};

export function ReportsPage() {
  const { stocks, isLoading, error } = useWalletContext();

  if (isLoading) {
    return <div className={pageStyles.loadingState}>Aguarde...</div>;
  }

  if (error) {
    return <div className={pageStyles.errorState}>{error}</div>;
  }

  return (
    <div>
      <div className={pageStyles.pageHeader}>
        <div className={pageStyles.pageTitle}>Relatórios</div>
        <div className={pageStyles.pageSubtitle}>
          Baixe o resumo da sua carteira em PDF, Excel ou CSV
        </div>
      </div>

      <Reveal delay={0}>
        <ExportButtons stocks={stocks} />
      </Reveal>

      <Reveal delay={0.05} className={pageStyles.sectionGap}>
        <div style={styles.previewCard}>
          <div style={styles.previewHeader}>Pré-visualização</div>
          <div style={styles.previewHint}>
            Estes são os dados que serão incluídos no arquivo exportado.
          </div>

          {stocks.length === 0 ? (
            <div style={styles.emptyState}>Nenhuma ação cadastrada ainda.</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Ticker</th>
                    <th style={styles.th}>Empresa</th>
                    <th style={{ ...styles.th, ...styles.numeric }}>Quantidade</th>
                    <th style={{ ...styles.th, ...styles.numeric }}>Preço Compra</th>
                    <th style={{ ...styles.th, ...styles.numeric }}>Preço Atual</th>
                    <th style={{ ...styles.th, ...styles.numeric }}>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => {
                    const result = stock.quantity * (stock.currentPrice - stock.buyPrice);
                    const isPositive = result >= 0;
                    return (
                      <tr key={stock.id}>
                        <td style={{ ...styles.td, ...styles.tickerCell }}>{stock.ticker}</td>
                        <td style={styles.td}>{stock.name}</td>
                        <td style={{ ...styles.td, ...styles.numeric }}>{stock.quantity}</td>
                        <td style={{ ...styles.td, ...styles.numeric }}>{formatCurrency(stock.buyPrice)}</td>
                        <td style={{ ...styles.td, ...styles.numeric }}>{formatCurrency(stock.currentPrice)}</td>
                        <td
                          style={{
                            ...styles.td,
                            ...styles.numeric,
                            ...(isPositive ? styles.positive : styles.negative),
                          }}
                        >
                          {formatCurrency(result)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}