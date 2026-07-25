// Página dedicada a gerar relatórios. Mostra uma pré-visualização
// (só leitura) dos dados que vão para o arquivo, e os botões pra
// baixar em PDF, Excel ou CSV — usando exatamente o mesmo
// "reportService" e os mesmos dados da carteira, sem duplicar lógica.

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

      <Reveal>
        <ExportButtons stocks={stocks} />
      </Reveal>

      <Reveal delay={0.05} className={pageStyles.sectionGap}>
        <div className={previewStyles.previewCard}>
          <div className={previewStyles.previewHeader}>Pré-visualização</div>
          <div className={previewStyles.previewHint}>
            Estes são os dados que serão incluídos no arquivo exportado.
          </div>

          {stocks.length === 0 ? (
            <div className={previewStyles.previewHint}>Nenhuma ação cadastrada ainda.</div>
          ) : (
            <div className={previewStyles.tableWrapper}>
              <table className={previewStyles.table}>
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Empresa</th>
                    <th className={previewStyles.numeric}>Quantidade</th>
                    <th className={previewStyles.numeric}>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.id}>
                      <td>{stock.ticker}</td>
                      <td>{stock.name}</td>
                      <td className={previewStyles.numeric}>{stock.quantity}</td>
                      <td className={previewStyles.numeric}>{formatCurrency(stock.profitLoss)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}