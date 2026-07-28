// backend-node/src/server.ts

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cron from 'node-cron';
import stockRoutes from './routes/stockRoutes';
import { refreshAllPrices } from './services/marketService';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose
  .connect('mongodb://localhost:27017/atlascapital')
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api', stockRoutes);

// Cron job: atualiza preços a cada 30 minutos (opcional)
cron.schedule('*/30 * * * *', async () => {
  console.log('🔄 Atualizando cotações automaticamente...');
  try {
    const result = await refreshAllPrices();
    console.log(`✅ ${result.updated} ações atualizadas. Falhas: ${result.failed.length}`);
  } catch (error) {
    console.error('❌ Erro na atualização automática:', error);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server Node rodando em http://localhost:${PORT}`);
});