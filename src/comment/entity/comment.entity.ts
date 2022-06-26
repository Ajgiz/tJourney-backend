import { CommentModel } from './../model/comment.model';
import { ObjectId, Types } from 'mongoose';
import { MongoId } from 'src/mongoose.interface';

export class CommentEntity {
  text: string;
  user: MongoId;
  _id: MongoId;
  post: MongoId;
  constructor(obj: CommentModel & { _id: MongoId }) {
    this._id = obj._id;
    this.text = obj.text;
    this.user = obj.user;
    this.post = obj.post;
  }
}
