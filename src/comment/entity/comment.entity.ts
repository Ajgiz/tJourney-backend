import { CommentModel } from './../model/comment.model';
import { ObjectId, Types } from 'mongoose';
import { ITimestaps, MongoId } from '../../mongoose.interface';

export class CommentEntity {
  text: string;
  user: MongoId;
  _id: MongoId;
  post: MongoId;
  createdAt: string;
  updatedAt: string;

  constructor(obj: CommentModel & ITimestaps & { _id: MongoId }) {
    this._id = obj._id;
    this.text = obj.text;
    this.user = obj.user;
    this.post = obj.post;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
