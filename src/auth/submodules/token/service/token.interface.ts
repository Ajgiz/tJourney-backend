import { ObjectId } from 'mongodb';

export interface IFindOneRefreshToken {
  _id?: ObjectId;
  token?: string;
}
export interface IPayloadRefreshToken {
  id: ObjectId;
  email: string;
}
