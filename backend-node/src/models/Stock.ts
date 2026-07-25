import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  ticker: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: string; // formato "YYYY-MM-DD"
}

const StockSchema = new Schema<IStock>({
  ticker: { type: String, required: true, uppercase: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0.01 },
  buyPrice: { type: Number, required: true, min: 0.01 },
  currentPrice: { type: Number, required: true, min: 0.01 },
  purchaseDate: { type: String, required: true },
}, {
  timestamps: true, // adiciona createdAt e updatedAt
});

export default mongoose.model<IStock>('Stock', StockSchema);