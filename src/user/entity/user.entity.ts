import { UserModel } from '../model/user.model';
import { ObjectId } from 'mongodb';

export class UserEntity {
  fullName: string;
  _id: ObjectId;
  email: string;
  avatar: string;
  subscriptionBlogs: ObjectId[];
  subscriptionCommunities: ObjectId[];
  subscribers: ObjectId[];
  description: string;
  cover: string;
  constructor(obj: UserModel & { _id: ObjectId }) {
    this.avatar = obj.avatar;
    this._id = obj._id;
    this.email = obj.email;
    this.fullName = obj.fullName;
    this.description = obj.description;
    this.cover = obj.cover;
    this.subscribers = obj.subscribers;
    this.subscriptionBlogs = obj.subscriptionBlogs;
    this.subscriptionCommunities = obj.subscriptionCommunities;
  }
}
