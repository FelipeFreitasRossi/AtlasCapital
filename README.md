# AtlasCapital 📈

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/Python-3.11%2B-blue)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/atlas)
[![Vite](https://img.shields.io/badge/Vite-React-646CFF)](https://vitejs.dev/)
[![Deploy](https://img.shields.io/badge/Deploy-Netlify%20%7C%20Render-blue)](https://app.netlify.com/)

**AtlasCapital** é uma aplicação web completa para gestão de carteira de investimentos. Permite cadastrar ações, acompanhar rentabilidade com gráficos interativos, exportar relatórios em PDF/Excel/CSV, simular operações, receber alertas e previsões com inteligência artificial mockada.

> 🚀 **Projeto pronto para produção** – hospedado na Netlify (frontend) e Render (backends), com MongoDB Atlas.

---

## ✨ Funcionalidades

- 📊 **Dashboard interativo** – cards de resumo, gráfico de barras por rentabilidade (verde/vermelho) e dica de diversificação.
- 📋 **Cadastro e gestão de ações** – ticker, quantidade, preços, data de compra, com busca automática de preço real via Yahoo Finance.
- 📈 **Previsão de preço** – projeção estatística (regressão linear) com intervalo de confiança.
- 🔄 **Simulação "E se"** – veja o impacto de compras/vendas hipotéticas na carteira.
- 🔔 **Alertas personalizados** – notificações por queda percentual, preço alvo ou patrimônio total.
- 📄 **Exportação de relatórios** – PDF, Excel (XLSX) e CSV, com pré-visualização.
- 🔐 **Autenticação JWT** – registro, login e sessão persistente com token.
- 📱 **Design responsivo** – tema escuro refinado, animações com GSAP, menu mobile.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18 + TypeScript**
- **Vite** – build rápido
- **React Router DOM** – navegação SPA
- **React Hook Form + Zod** – validação de formulários
- **Recharts** – gráficos interativos
- **GSAP** – animações de scroll e transições
- **Lucide React** – ícones
- **date-fns** – manipulação de datas
- **jspdf / xlsx** – exportação de relatórios

### Backend Node.js
- **Express.js**
- **Mongoose** – modelagem MongoDB
- **bcryptjs + jsonwebtoken** – autenticação JWT
- **yahoo-finance2** – cotações reais
- **node-cron** – atualização automática de preços

### Backend Python (FastAPI)
- **FastAPI** – API de IA e relatórios
- **APScheduler** – agendamento de alertas
- **pandas / numpy** – análise de dados
- **matplotlib** – geração de gráficos em PDF
- **reportlab** – relatórios PDF
- **openpyxl** – exportação Excel

### Banco de Dados
- **MongoDB Atlas** – armazenamento de usuários, ações e alertas (JSON simulado para alertas no Python)

### DevOps
- **Netlify** – hospedagem frontend (SPA)
- **Render** – hospedagem backends (Node.js e Python)
- **GitHub** – controle de versão

---

## 📦 Pré-requisitos

Antes de rodar o projeto localmente, você precisa ter instalado:

- **Node.js** (v18 ou superior) – [Download](https://nodejs.org/)
- **Python** (v3.11 ou superior) – [Download](https://www.python.org/)
- **MongoDB** (local) ou uma conta no **MongoDB Atlas** – [Atlas](https://www.mongodb.com/atlas)
- **Git** – [Download](https://git-scm.com/)

---

## 🚀 Instalação e Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/FelipeFreitasRossi/AtlasCapital.git
cd AtlasCapital

2. Backend Node.js
cd backend-node
npm install
# Crie um arquivo .env com as variáveis (veja o exemplo abaixo)
npm run dev

.env (backend-node)
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/?appName=BancoProjeto
JWT_SECRET=sua_chave_secreta
PORT=5000

3. Backend Python (FastAPI)
cd backend-python
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

.env (backend-python)
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/?appName=BancoProjeto
SECRET_KEY=outra_chave_secreta

4. Frontend (React + Vite)
cd frontend
npm install
# Crie um arquivo .env.local para desenvolvimento (opcional)
npm run dev

.env.local (frontend – desenvolvimento)
VITE_NODE_API_URL=http://localhost:5000/api
VITE_PYTHON_API_URL=http://localhost:8000/api

5. Acesse a aplicação
Frontend: http://localhost:5173

Node API: http://localhost:5000/api

Python API: http://localhost:8000/docs (Swagger)

🌐 Deploy (Hospedagem)
Frontend – Netlify
Conecte o repositório ao Netlify.

Configure:

Base directory: frontend

Build command: npm run build

Publish directory: dist

Adicione as variáveis de ambiente:

VITE_NODE_API_URL = https://seu-node.onrender.com/api

VITE_PYTHON_API_URL = https://seu-python.onrender.com/api

Backend Node.js – Render
Crie um Web Service apontando para o repositório.

Root Directory: backend-node

Build Command: npm install

Start Command: npm start

Variáveis:

MONGO_URI (MongoDB Atlas)

JWT_SECRET

Backend Python – Render
Crie um Web Service.

Root Directory: backend-python

Build Command: pip install -r requirements.txt

Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

Variáveis:

MONGO_URI

SECRET_KEY

Banco de Dados – MongoDB Atlas
Crie um cluster gratuito (M0).

Adicione 0.0.0.0/0 em Network Access (ou os IPs do Render).

Copie a string de conexão e use nos backends.

🔗 Links do projeto em produção:

Frontend: https://atlascapitalbr.netlify.app

Node API: https://atlascapital-node-api.onrender.com

Python API: https://atlascapital-python-api.onrender.com

📁 Estrutura do Projeto
AtlasCapital/
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas (Dashboard, Carteira, etc.)
│   │   ├── services/        # APIs e serviços
│   │   ├── context/         # Contextos (Auth, Calendar)
│   │   ├── hooks/           # Hooks customizados
│   │   └── types/           # Tipagens TypeScript
│   ├── public/
│   └── package.json
├── backend-node/            # Express + Mongoose
│   ├── src/
│   │   ├── models/          # Modelos (User, Stock)
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Lógica de negócio
│   │   └── middleware/      # Autenticação
│   ├── .env.example
│   └── package.json
├── backend-python/          # FastAPI
│   ├── app/
│   │   ├── routers/         # Endpoints (forecast, alerts, etc.)
│   │   ├── services/        # Lógica de IA e relatórios
│   │   └── models/          # Pydantic schemas
│   ├── requirements.txt
│   └── .env.example
└── README.md

🤝 Contribuição
Contribuições são bem-vindas! Siga os passos:

Fork este repositório.

Crie uma branch para sua feature (git checkout -b feature/nova-funcionalidade).

Commit suas alterações (git commit -m 'Adiciona nova funcionalidade').

Push para a branch (git push origin feature/nova-funcionalidade).

Abra um Pull Request.

📝 Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

💬 Contato
Felipe Freitas Rossi
GitHub
