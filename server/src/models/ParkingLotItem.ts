import mongoose, { Schema, type Model } from 'mongoose';

export interface IParkingLotItem {
  text: string;
}

const ParkingLotItemSchema = new Schema<IParkingLotItem>(
  {
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const ParkingLotItem: Model<IParkingLotItem> =
  mongoose.models.ParkingLotItem ?? mongoose.model<IParkingLotItem>('ParkingLotItem', ParkingLotItemSchema);

export default ParkingLotItem;
