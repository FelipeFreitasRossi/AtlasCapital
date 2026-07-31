// backend-node/src/server.ts

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cron from 'node-cron';
import stockRoutes from './routes/stockRoutes';
import authRoutes from './routes/authRoutes';
import { refreshAllPrices } from './services/marketService';

// Carrega variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Variável para armazenar a URI do MongoDB (para debug)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/atlascapital';
console.log(`🔗 Conectando ao MongoDB: ${mongoURI.replace(/\/\/.*@/, '//<hidden>@')}`);

// Conecta ao MongoDB com opções de timeout aumentadas
mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    // Adiciona opções adicionais para melhor compatibilidade
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
    console.log(`📦 Banco de dados: ${mongoose.connection.db?.databaseName || 'desconhecido'}`);
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    console.error('🔄 Tentando novamente em 5 segundos...');
    // Reconexão automática (opcional)
    setTimeout(() => {
      mongoose.connect(mongoURI).catch(e => console.error('❌ Falha na reconexão:', e.message));
    }, 5000);
  });

// Eventos de conexão para monitoramento
mongoose.connection.on('connected', () => {
  console.log('📡 Conexão MongoDB estabelecida');
});
mongoose.connection.on('error', (err) => {
  console.error('⚠️ Erro na conexão MongoDB:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.log('📡 Conexão MongoDB desconectada');
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', stockRoutes);

// Rota de saúde para verificar status da API e do banco
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    service: 'atlascapital-node-api',
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

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

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Server Node rodando em http://localhost:${PORT}`);
  console.log(`🌐 Endpoint de health: http://localhost:${PORT}/api/health`);
});

// Tratamento de encerramento gracioso
process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido SIGINT. Encerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});