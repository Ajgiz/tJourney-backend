import { MongoId, ITimestaps } from './../../mongoose.interface';
import { PostModel } from './../model/post.model';

export class PostEntity {
  title: string;
  _id: MongoId;
  body: string[];
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  constructor(obj: PostModel & ITimestaps & { _id: MongoId }) {
    this.body = obj.body;
    this.tags = obj.tags;
    this._id = obj._id;
    this.title = obj.title;
    this.views = obj.views;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }
}
