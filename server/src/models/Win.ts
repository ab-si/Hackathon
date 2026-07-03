import mongoose, { Schema, type Model } from 'mongoose';

export interface IWin {
  hackathonId: mongoose.Types.ObjectId;
  text: string;
  time: number;
}

const WinSchema = new Schema<IWin>(
  {
    hackathonId: { type: Schema.Types.ObjectId, required: true, index: true },
    text: { type: String, required: true, trim: true },
    time: { type: Number, default: () => Date.now() },
  },
  { timestamps: true },
);

const Win: Model<IWin> =
  mongoose.models.HackathonWin ?? mongoose.model<IWin>('HackathonWin', WinSchema, 'hackathon_wins');

export default Win;
