import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import stockRoutes from './routes/stockRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/atlascapital')
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api', stockRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server Node rodando em http://localhost:${PORT}`);
});