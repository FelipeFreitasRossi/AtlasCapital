// Este arquivo define o "formato" dos dados de uma Ação.
// Em TypeScript, uma "interface" é como uma ficha de cadastro:
// ela diz quais campos existem e de que tipo eles são.

export interface Stock {
  id: string;
  ticker: string; // Ex: PETR4
  name: string; // Ex: Petrobras
  quantity: number;
  buyPrice: number; // preço pago por ação
  currentPrice: number; // preço atual da ação no mercado
  purchaseDate: string; // formato "AAAA-MM-DD"
}

// Quando vamos CRIAR uma ação nova, ainda não temos o "id"
// (quem gera o id é o backend). Por isso criamos um tipo derivado
// que é igual ao Stock, mas sem o campo "id".
export type StockInput = Omit<Stock, "id">;

// Esse tipo representa os números já calculados de uma ação,
// como o lucro/prejuízo em reais e em porcentagem.
export interface StockWithMetrics extends Stock {
  investedValue: number; // quanto foi investido (quantidade x preço de compra)
  currentValue: number; // quanto vale hoje (quantidade x preço atual)
  profitLoss: number; // lucro ou prejuízo em R$
  profitLossPercent: number; // lucro ou prejuízo em %
}
