import { MongoId } from './../../../../mongoose.interface';
export interface IFindOneRefreshToken {
  id: MongoId;
  token: string;
}
export interface IPayloadRefreshToken {
  id: MongoId;
  email: string;
}
