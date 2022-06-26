import { MongoId } from './../../mongoose.interface';

export interface IPayloadJwt {
  email: string;
  fullName: string;
  id: MongoId;
}
