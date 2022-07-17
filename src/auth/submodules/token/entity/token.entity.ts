import { ObjectId } from 'mongodb';
import { TokenModel } from './../model/token.model';

export class TokenEntity {
  user: ObjectId;
  refreshToken: string;
  _id: ObjectId;
  constructor(obj: TokenModel & { _id: ObjectId }) {
    this.refreshToken = obj.refreshToken;
    this._id = obj._id;
    this.user = obj.user;
  }
}
