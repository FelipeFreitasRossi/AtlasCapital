// backend-node/src/server.ts

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import stockRoutes from './routes/stockRoutes';
import authRoutes from './routes/authRoutes';
import cron from 'node-cron';
import { refreshAllPrices } from './services/marketService';

// Carrega as variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conecta ao MongoDB usando a URI do .env
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/atlascapital')
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api', stockRoutes);

// Cron job para atualizar preços a cada 30 minutos
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