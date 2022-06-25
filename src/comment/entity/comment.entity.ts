import { CommentModel } from './../model/comment.model';
import { ObjectId, Types } from 'mongoose';
import { ModelId } from 'src/mongoose.interface';

export class CommentEntity {
  text: string;
  user: ObjectId;
  _id: ModelId;
  post: ObjectId;
  constructor(obj: CommentModel & { _id: ModelId }) {
    this._id = obj._id;
    this.text = obj.text;
    this.user = obj.user;
    this.post = obj.post;
  }
}
