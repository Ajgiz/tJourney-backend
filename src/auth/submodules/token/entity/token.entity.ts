import { TokenModel } from './../model/token.model';
import { MongoId } from './../../../../mongoose.interface';

export class TokenEntity {
  user: MongoId;
  refreshToken: string;
  _id: MongoId;
  constructor(obj: TokenModel & { _id: MongoId }) {
    this.refreshToken = obj.refreshToken;
    this._id = obj._id;
    this.user = obj.user;
  }
}
