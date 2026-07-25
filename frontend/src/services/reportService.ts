// Este arquivo cuida de GERAR os relatórios que o usuário baixa
// (PDF, Excel e CSV). Por enquanto, tudo é feito aqui mesmo, no
// navegador, usando os dados que já estão na tela (em memória).
//
// No futuro, quando a API em Python estiver pronta, essas mesmas
// funções podem ser trocadas para simplesmente baixar o arquivo
// pronto que o backend devolver (veja os comentários "Versão real"
// em cada função).

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
// PYTHON_API_URL fica em "./apiConfig" e é usado nos comentários abaixo
// como referência de onde os endpoints reais vão entrar no futuro.
import type { StockWithMetrics } from "../types/stock";

// Formata um número como dinheiro em reais, ex: 1234.5 -> "R$ 1.234,50"
function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Formata a data "AAAA-MM-DD" para "DD/MM/AAAA", mais familiar no Brasil.
function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

// ------------------------------------------------------------------
// PDF
// ------------------------------------------------------------------
export function downloadPdfReport(stocks: StockWithMetrics[]): void {
  const doc = new jsPDF();

  // Título do relatório
  doc.setFontSize(18);
  doc.setTextColor(15, 33, 61); // azul marinho
  doc.text("AtlasCapital - Relatório de Carteira", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  const today = new Date().toLocaleDateString("pt-BR");
  doc.text(`Gerado em ${today}`, 14, 27);

  // Tabela com os dados de cada ação
  autoTable(doc, {
    startY: 34,
    head: [
      [
        "Ticker",
        "Empresa",
        "Qtd.",
        "Preço Compra",
        "Preço Atual",
        "Resultado (R$)",
        "Resultado (%)",
      ],
    ],
    body: stocks.map((stock) => [
      stock.ticker,
      stock.name,
      stock.quantity.toString(),
      formatCurrency(stock.buyPrice),
      formatCurrency(stock.currentPrice),
      formatCurrency(stock.profitLoss),
      `${stock.profitLossPercent.toFixed(2)}%`,
    ]),
    headStyles: { fillColor: [15, 33, 61] }, // azul marinho
    didParseCell: (data) => {
      // Pinta a coluna de resultado de verde ou vermelho
      if (data.section === "body" && (data.column.index === 5 || data.column.index === 6)) {
        const stock = stocks[data.row.index];
        data.cell.styles.textColor = stock.profitLoss >= 0 ? [22, 132, 62] : [180, 35, 24];
      }
    },
  });

  // Resumo final, logo abaixo da tabela
  const totalInvested = stocks.reduce((sum, s) => sum + s.investedValue, 0);
  const totalCurrent = stocks.reduce((sum, s) => sum + s.currentValue, 0);
  const totalProfit = totalCurrent - totalInvested;

  // "lastAutoTable" é preenchido automaticamente pelo plugin autoTable
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.setTextColor(15, 33, 61);
  doc.text(`Patrimônio total: ${formatCurrency(totalCurrent)}`, 14, finalY);
  doc.setTextColor(totalProfit >= 0 ? 22 : 180, totalProfit >= 0 ? 132 : 35, totalProfit >= 0 ? 62 : 24);
  doc.text(`Resultado consolidado: ${formatCurrency(totalProfit)}`, 14, finalY + 7);

  doc.save("atlascapital-relatorio.pdf");

  // Versão real (API Python pronta), troca a função inteira por:
  //
  // const response = await fetch(`${PYTHON_API_URL}/reports/pdf`);
  // const blob = await response.blob();
  // const url = window.URL.createObjectURL(blob);
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = "atlascapital-relatorio.pdf";
  // link.click();
  // window.URL.revokeObjectURL(url);
}

// ------------------------------------------------------------------
// EXCEL (.xlsx)
// ------------------------------------------------------------------
export function downloadExcelReport(stocks: StockWithMetrics[]): void {
  const rows = stocks.map((stock) => ({
    Ticker: stock.ticker,
    Empresa: stock.name,
    Quantidade: stock.quantity,
    "Preço de Compra": stock.buyPrice,
    "Preço Atual": stock.currentPrice,
    "Data da Compra": formatDate(stock.purchaseDate),
    "Valor Investido": Number(stock.investedValue.toFixed(2)),
    "Valor Atual": Number(stock.currentValue.toFixed(2)),
    "Resultado (R$)": Number(stock.profitLoss.toFixed(2)),
    "Resultado (%)": Number(stock.profitLossPercent.toFixed(2)),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Carteira");

  // Deixa as colunas com uma largura mais confortável de leitura
  worksheet["!cols"] = [
    { wch: 10 }, // Ticker
    { wch: 22 }, // Empresa
    { wch: 12 }, // Quantidade
    { wch: 15 }, // Preço de Compra
    { wch: 15 }, // Preço Atual
    { wch: 15 }, // Data da Compra
    { wch: 16 }, // Valor Investido
    { wch: 16 }, // Valor Atual
    { wch: 15 }, // Resultado R$
    { wch: 15 }, // Resultado %
  ];

  XLSX.writeFile(workbook, "atlascapital-relatorio.xlsx");

  // Versão real (API Python pronta):
  //
  // const response = await fetch(`${PYTHON_API_URL}/reports/excel`);
  // const blob = await response.blob();
  // ...mesmo padrão de download usado no PDF acima.
}

// ------------------------------------------------------------------
// CSV
// ------------------------------------------------------------------
export function downloadCsvReport(stocks: StockWithMetrics[]): void {
  const header = [
    "Ticker",
    "Empresa",
    "Quantidade",
    "Preco de Compra",
    "Preco Atual",
    "Data da Compra",
    "Valor Investido",
    "Valor Atual",
    "Resultado (R$)",
    "Resultado (%)",
  ];

  const lines = stocks.map((stock) =>
    [
      stock.ticker,
      stock.name,
      stock.quantity,
      stock.buyPrice.toFixed(2),
      stock.currentPrice.toFixed(2),
      formatDate(stock.purchaseDate),
      stock.investedValue.toFixed(2),
      stock.currentValue.toFixed(2),
      stock.profitLoss.toFixed(2),
      stock.profitLossPercent.toFixed(2),
    ].join(";"),
  );

  // O ";" separa as colunas (funciona melhor com Excel em pt-BR)
  const csvContent = [header.join(";"), ...lines].join("\n");

  // Adiciona o "BOM" (\uFEFF) para o Excel abrir acentos corretamente
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "atlascapital-relatorio.csv";
  link.click();
  URL.revokeObjectURL(url);

  // Versão real (API Python pronta):
  //
  // const response = await fetch(`${PYTHON_API_URL}/reports/csv`);
  // const text = await response.text();
  // ...gera o Blob com o "text" recebido, em vez do csvContent montado aqui.
}
