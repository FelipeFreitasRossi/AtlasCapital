// backend-node/src/models/Stock.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  ticker: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: string;
  lastUpdated: Date;
  previousClose?: number;
  changePercent?: number;
}

const StockSchema = new Schema<IStock>(
  {
    ticker: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    buyPrice: { type: Number, required: true, min: 0.01 },
    currentPrice: { type: Number, required: true, min: 0.01 },
    purchaseDate: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    previousClose: { type: Number },
    changePercent: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStock>('Stock', StockSchema);