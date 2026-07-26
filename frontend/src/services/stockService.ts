// Este arquivo é a "ponte" entre a interface e o backend.
// Como o backend (Node.js) ainda não está pronto, cada função abaixo
// SIMULA uma chamada de API: espera um pouquinho (como se fosse a
// internet) e devolve dados guardados na memória do navegador.
//
// Quando o backend estiver pronto, basta descomentar o código do
// "fetch" (já deixei pronto, comentado, dentro de cada função) e
// remover a parte "mockada". A ASSINATURA das funções (o que elas
// recebem e o que devolvem) não muda, então o resto do app não
// precisa ser alterado.

// NODE_API_URL fica em "./apiConfig" e é usado nos comentários abaixo
// como referência de onde os endpoints reais vão entrar no futuro.
import type { Stock, StockInput } from "../types/stock";

// Pequena função auxiliar que "finge" um tempo de espera de rede.
// Isso deixa o app com uma sensação mais realista (loading, etc).
function fakeNetworkDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Gera um id simples e único para os dados mockados.
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 7);
}

// ------------------------------------------------------------------
// "Banco de dados" falso, guardado em memória (some quando recarrega
// a página). Já vem com alguns exemplos para você ver a tela funcionando.
// ------------------------------------------------------------------
let mockStocks: Stock[] = [
  {
    id: "1",
    ticker: "PETR4",
    name: "Petrobras",
    quantity: 100,
    buyPrice: 28.5,
    currentPrice: 35.2,
    purchaseDate: "2025-01-10",
  },
  {
    id: "2",
    ticker: "VALE3",
    name: "Vale",
    quantity: 50,
    buyPrice: 68.9,
    currentPrice: 61.4,
    purchaseDate: "2025-02-05",
  },
  {
    id: "3",
    ticker: "ITUB4",
    name: "Itaú Unibanco",
    quantity: 200,
    buyPrice: 30.1,
    currentPrice: 33.75,
    purchaseDate: "2024-11-20",
  },
  {
    id: "4",
    ticker: "MGLU3",
    name: "Magazine Luiza",
    quantity: 300,
    buyPrice: 9.8,
    currentPrice: 6.2,
    purchaseDate: "2025-03-15",
  },
];

// GET /stocks -> lista todas as ações
export async function getStocks(): Promise<Stock[]> {
  await fakeNetworkDelay();

  // Quando o backend real existir, troque o bloco acima por:
  //
  // const response = await fetch(`${NODE_API_URL}/stocks`);
  // if (!response.ok) throw new Error("Não foi possível carregar as ações.");
  // return response.json();

  // Devolvemos uma cópia para evitar que alguém mude o "banco" sem querer.
  return [...mockStocks];
}

// POST /stocks -> cria uma ação nova
export async function createStock(data: StockInput): Promise<Stock> {
  await fakeNetworkDelay();

  const newStock: Stock = { id: generateId(), ...data };
  mockStocks = [...mockStocks, newStock];
  return newStock;

  // Versão real (backend Node.js pronto):
  //
  // const response = await fetch(`${NODE_API_URL}/stocks`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error("Não foi possível cadastrar a ação.");
  // return response.json();
}

// PUT /stocks/:id -> atualiza uma ação existente
export async function updateStock(id: string, data: StockInput): Promise<Stock> {
  await fakeNetworkDelay();

  const updated: Stock = { id, ...data };
  mockStocks = mockStocks.map((stock) => (stock.id === id ? updated : stock));
  return updated;

  // Versão real:
  //
  // const response = await fetch(`${NODE_API_URL}/stocks/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error("Não foi possível atualizar a ação.");
  // return response.json();
}

// DELETE /stocks/:id -> apaga uma ação
export async function deleteStock(id: string): Promise<void> {
  await fakeNetworkDelay();

  mockStocks = mockStocks.filter((stock) => stock.id !== id);

  // Versão real:
  //
  // const response = await fetch(`${NODE_API_URL}/stocks/${id}`, {
  //   method: "DELETE",
  // });
  // if (!response.ok) throw new Error("Não foi possível apagar a ação.");
}
