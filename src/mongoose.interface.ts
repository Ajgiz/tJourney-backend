import mongoose from 'mongoose';
export type MongoId = mongoose.Types.ObjectId;
export interface ITimestaps {
  createdAt: string;
  updatedAt: string;
}
