import { IPersonInfo } from 'src/post/service/post-service.interface';
import { ObjectId } from 'mongodb';
export interface IFindOneUser {
  fullName?: string;
  email?: string;
}

export interface ISubscribesInfo extends IPersonInfo {
  _id: ObjectId;
}
