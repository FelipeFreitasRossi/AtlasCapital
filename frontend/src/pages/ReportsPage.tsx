// frontend/src/pages/ReportsPage.tsx
// ReportsPage.tsx - com estilos de pré-visualização

import pageStyles from "./Page.module.css";
import previewStyles from "./ReportsPreview.module.css";

import { ExportButtons } from "../components/ExportButtons/ExportButtons";
import { Reveal } from "../components/Reveal/Reveal";
import { useWalletContext } from "../components/Layout/AppShell";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ReportsPage() {
  const { stocks, isLoading, error } = useWalletContext();

  if (isLoading) {
    return <div className={pageStyles.loadingState}>Carregando sua carteira...</div>;
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
        <div className={previewStyles.previewCard}>
          <div className={previewStyles.previewHeader}>Pré-visualização</div>
          <div className={previewStyles.previewHint}>
            Estes são os dados que serão incluídos no arquivo exportado.
          </div>

          {stocks.length === 0 ? (
            <div className={previewStyles.emptyState}>Nenhuma ação cadastrada ainda.</div>
          ) : (
            <div className={previewStyles.tableWrapper}>
              <table className={previewStyles.table}>
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Empresa</th>
                    <th className={previewStyles.numeric}>Quantidade</th>
                    <th className={previewStyles.numeric}>Preço Compra</th>
                    <th className={previewStyles.numeric}>Preço Atual</th>
                    <th className={previewStyles.numeric}>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => {
                    const result = stock.quantity * (stock.currentPrice - stock.buyPrice);
                    const isPositive = result >= 0;
                    return (
                      <tr key={stock.id}>
                        <td className={previewStyles.tickerCell}>{stock.ticker}</td>
                        <td>{stock.name}</td>
                        <td className={previewStyles.numeric}>{stock.quantity}</td>
                        <td className={previewStyles.numeric}>{formatCurrency(stock.buyPrice)}</td>
                        <td className={previewStyles.numeric}>{formatCurrency(stock.currentPrice)}</td>
                        <td className={`${previewStyles.numeric} ${isPositive ? previewStyles.positive : previewStyles.negative}`}>
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