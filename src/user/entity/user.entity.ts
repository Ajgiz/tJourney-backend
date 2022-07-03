import { MongoId } from '../../mongoose.interface';
import { UserModel } from '../model/user.model';

export class UserEntity {
  fullName: string;
  _id: MongoId;
  email: string;
  avatar: string;

  constructor(obj: UserModel & { _id: MongoId }) {
    this.avatar = obj.avatar;
    this._id = obj._id;
    this.email = obj.email;
    this.fullName = obj.fullName;
  }
}
