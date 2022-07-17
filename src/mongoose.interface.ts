import mongoose from 'mongoose';
export type MongoId = mongoose.Types.ObjectId;
export interface ITimestaps {
  createdAt: string;
  updatedAt: string;
}

export enum NAME_MODEL_ENUM {
  COMMUNITY = 'communities',
  USER = 'users',
  POST = 'posts',
  COMMENT = 'comments',
  TOKEN = 'tokens',
}
