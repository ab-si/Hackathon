import mongoose, { Schema, type Model } from 'mongoose';

export interface IWin {
  text: string;
  time: number;
}

const WinSchema = new Schema<IWin>(
  {
    text: { type: String, required: true, trim: true },
    time: { type: Number, default: () => Date.now() },
  },
  { timestamps: true },
);

const Win: Model<IWin> = mongoose.models.Win ?? mongoose.model<IWin>('Win', WinSchema);

export default Win;
