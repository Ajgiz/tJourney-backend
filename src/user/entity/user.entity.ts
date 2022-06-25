import { ModelId } from 'src/mongoose.interface';
import { UserModel } from '../model/user.model';

export class UserEntity {
  fullName: string;
  password?: string | undefined;
  _id: ModelId;
  email: string;
  avatar: string;

  constructor(obj: UserModel & { _id: ModelId }) {
    this.avatar = obj.avatar;
    this._id = obj._id;
    this.email = obj.email;
    this.fullName = obj.fullName;
    this.password = obj.password;
  }
}
