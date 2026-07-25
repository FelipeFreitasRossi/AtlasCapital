# RELATÓRIO_FRONTEND.md — AtlasCapital

Este documento explica, em detalhes, o que foi construído na pasta `frontend/` do projeto AtlasCapital.

---

## 1. Estrutura de pastas criada

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── src/
    ├── main.tsx                 # ponto de entrada do React
    ├── App.tsx                  # componente raiz, organiza a tela
    ├── App.module.css
    ├── index.css                # variáveis de cor globais (design tokens)
    ├── vite-env.d.ts
    │
    ├── types/
    │   └── stock.ts              # tipos TypeScript (Stock, StockInput, StockWithMetrics)
    │
    ├── services/                 # camada que "conversa" com o backend
    │   ├── apiConfig.ts          # URLs base das APIs (Node e Python)
    │   ├── stockService.ts       # CRUD de ações (mockado, já pronto pra API real)
    │   └── reportService.ts      # geração de PDF/Excel/CSV
    │
    ├── hooks/
    │   └── useStocks.ts          # estado da carteira + cálculos de lucro/prejuízo
    │
    └── components/
        ├── Layout/
        │   └── Header.tsx        # topo da página, com o botão "Nova Ação"
        ├── StatsCards/
        │   └── StatsCards.tsx    # os 3 cartões de resumo (investido, patrimônio, resultado)
        ├── Dashboard/
        │   └── Dashboard.tsx     # gráfico de barras (Recharts) verde/vermelho
        ├── StockTable/
        │   └── StockTable.tsx    # tabela com todas as ações
        ├── StockForm/
        │   └── StockForm.tsx     # modal de cadastro/edição, com validação
        └── ExportButtons/
            └── ExportButtons.tsx # botões de baixar PDF / Excel / CSV
```

Cada componente tem seu próprio arquivo `.module.css` do lado, com o mesmo nome (CSS Modules).

---

## 2. Componentes criados e suas responsabilidades

- **`Header`** — Mostra a logo, o título "AtlasCapital" e o botão "+ Nova Ação". Não guarda nenhum dado; só avisa o `App.tsx` quando o botão é clicado.
- **`StatsCards`** — Mostra 3 números principais da carteira: valor investido, patrimônio atual e resultado consolidado (com cor verde ou vermelha).
- **`Dashboard`** — Desenha o gráfico de barras (uma barra por ação), verde para lucro e vermelha para prejuízo, usando a biblioteca Recharts.
- **`StockTable`** — Lista todas as ações em formato de tabela, com botões de "Editar" e "Apagar" em cada linha.
- **`StockForm`** — Um modal com formulário para cadastrar uma ação nova ou editar uma existente. Faz validação simples (campos obrigatórios, números maiores que zero, data preenchida) antes de enviar.
- **`ExportButtons`** — Três botões que chamam o `reportService` para gerar e baixar o PDF, o Excel e o CSV.

---

## 3. Como o estado foi gerenciado

Optei por **estado local do React (`useState` + `useMemo`), organizado dentro de um hook customizado chamado `useStocks`**, em vez de usar Redux ou Zustand.

**Por quê:**
- A aplicação tem **um único domínio de dados** (a lista de ações) e uma hierarquia de componentes rasa (o `App.tsx` é o "pai" de todo mundo). Não existe a necessidade de compartilhar estado entre partes distantes da árvore de componentes, que é o principal problema que Redux/Zustand resolvem.
- O hook `useStocks` já concentra toda a lógica (buscar, criar, editar, apagar, calcular lucro/prejuízo) em um único lugar, então o código fica organizado mesmo sem uma biblioteca externa.
- Menos dependências = projeto mais simples de entender para quem está começando, e mais fácil de trocar depois, se um dia fizer sentido migrar para Zustand (bastaria mover a lógica de dentro do hook para uma store, sem mudar os componentes).

Se no futuro a aplicação crescer bastante (por exemplo, múltiplas carteiras, autenticação de usuário, notificações em tempo real), Zustand seria a próxima escolha natural, por ser leve e simples de introduzir aos poucos.

---

## 4. Premissas assumidas (para validar com o backend)

1. **Formato das datas**: assumi que o campo `purchaseDate` vem como texto no formato `"AAAA-MM-DD"` (padrão do input `type="date"` do HTML), igual ao exemplo do contrato de API.
2. **Cálculo de lucro/prejuízo**: como o backend ainda não envia esses valores prontos, o frontend calcula tudo sozinho a partir de `quantity`, `buyPrice` e `currentPrice`:
   - Valor investido = `quantity * buyPrice`
   - Valor atual = `quantity * currentPrice`
   - Resultado = `valor atual - valor investido`
   - Quando o backend (Python) estiver pronto, vale confirmar se ele vai enviar esses campos já calculados — se sim, dá pra remover o cálculo do frontend e só exibir o que vier da API.
3. **Geração dos relatórios (PDF/Excel/CSV)**: por pedido do escopo, toda a exportação está sendo feita **100% no navegador** (com `jspdf`, `jspdf-autotable` e `xlsx`), usando os dados que já estão na tela. Deixei comentado, dentro de cada função em `reportService.ts`, como ficaria a troca para usar os endpoints reais (`GET /reports/pdf`, `/excel`, `/csv`) quando a API em Python estiver pronta — nesse caso, o frontend passaria a só baixar o arquivo que o backend devolver, em vez de gerar ele mesmo.
4. **Ids das ações**: como o backend Node ainda não existe, os `ids` são gerados no próprio navegador (`Date.now()` + número aleatório). Isso deve ser substituído pelo id real que a API Node vai gerar.
5. **Tratamento de erros da API**: a interface já está preparada pra mostrar uma mensagem de erro amigável caso a busca de ações falhe (por exemplo, se o servidor cair), mas os detalhes exatos de erro que a API real vai devolver (`400`, `500`, mensagens específicas) ainda precisam ser combinados com quem for construir o backend.
6. **Sem autenticação**: não há tela de login nem token sendo enviado nas chamadas. Se o projeto for ter usuários, essa camada precisa ser adicionada nos `services/`.

---

## 5. Como testar a interface

1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências (só precisa fazer isso uma vez):
   ```bash
   npm install
   ```
3. Rode o projeto:
   ```bash
   npm run dev
   ```
4. O terminal vai mostrar um endereço, geralmente `http://localhost:5173`. Abra esse endereço no navegador.

Você vai ver a tela já carregada com 4 ações de exemplo (PETR4, VALE3, ITUB4, MGLU3), o gráfico, a tabela e os botões de exportação — tudo funcionando com dados guardados na memória do navegador (eles somem se a página for recarregada, já que ainda não existe um backend real salvando essas informações).

Também é possível conferir se o projeto compila sem erros de tipo com:
```bash
npm run build
```

---

## 6. Próximos passos sugeridos (para o arquiteto de backend)

- Implementar os endpoints do contrato descrito (`GET/POST/PUT/DELETE /stocks`) na API Node.
- Decidir se os relatórios (PDF/Excel/CSV) vão continuar sendo gerados no frontend (mais simples, já está pronto) ou passar a ser gerados pela API Python (mais controle de padronização, mas exige trocar as 3 funções em `reportService.ts`, que já deixei comentadas e prontas pra essa troca).
- Confirmar o formato exato de erros retornados pela API, pra melhorar as mensagens mostradas ao usuário.
