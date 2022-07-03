import { MongoId } from './../../../../mongoose.interface';
export interface IFindOneRefreshToken {
  _id?: MongoId;
  token?: string;
}
export interface IPayloadRefreshToken {
  id: MongoId;
  email: string;
}
