// backend-node/src/models/Stock.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  ticker: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: string;
  userId: string;          // 👈 referência ao usuário
  lastUpdated: Date;       // 👈 para controle de atualização
  previousClose?: number;  // 👈 preço de fechamento anterior
  changePercent?: number;  // 👈 variação percentual
}

const StockSchema = new Schema<IStock>(
  {
    ticker: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    buyPrice: { type: Number, required: true, min: 0.01 },
    currentPrice: { type: Number, required: true, min: 0.01 },
    purchaseDate: { type: String, required: true },
    userId: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    previousClose: { type: Number },
    changePercent: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IStock>('Stock', StockSchema);