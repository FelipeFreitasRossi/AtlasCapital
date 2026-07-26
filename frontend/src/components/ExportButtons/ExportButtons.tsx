// Três botões simples: cada um chama uma função do "reportService"
// para gerar e baixar o relatório no formato escolhido.
// A lógica de geração dos arquivos não foi alterada — só o visual.

import { FileText, FileSpreadsheet, FileDown } from "lucide-react";
import styles from "./ExportButtons.module.css";
import { downloadCsvReport, downloadExcelReport, downloadPdfReport } from "../../services/reportService";
import type { StockWithMetrics } from "../../types/stock";

interface ExportButtonsProps {
  stocks: StockWithMetrics[];
}

export function ExportButtons({ stocks }: ExportButtonsProps) {
  const isDisabled = stocks.length === 0;

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.button} ${styles.primary}`}
        disabled={isDisabled}
        onClick={() => downloadPdfReport(stocks)}
      >
        <FileText size={16} />
        Baixar PDF
      </button>
      <button className={styles.button} disabled={isDisabled} onClick={() => downloadExcelReport(stocks)}>
        <FileSpreadsheet size={16} />
        Baixar Excel
      </button>
      <button className={styles.button} disabled={isDisabled} onClick={() => downloadCsvReport(stocks)}>
        <FileDown size={16} />
        Baixar CSV
      </button>
    </div>
  );
}
