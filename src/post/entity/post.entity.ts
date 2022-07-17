import { DataOutput } from '../dto/create-post.dto';
import { ITimestaps } from './../../mongoose.interface';
import { PostModel } from './../model/post.model';
import { ObjectId } from 'mongodb';

export class PostEntity {
  title: string;
  _id: ObjectId;
  body: DataOutput[];
  topic: ObjectId;
  author: ObjectId;
  views: ObjectId[];
  createdAt: string;
  updatedAt: string;
  likes: ObjectId[];
  dislikes: ObjectId[];

  constructor(obj: PostModel & ITimestaps & { _id: ObjectId }) {
    this.body = obj.body;
    this.topic = obj.topic;
    this._id = obj._id;
    this.title = obj.title;
    this.views = obj.views;
    this.createdAt = obj.createdAt;
    this.author = obj.author;
    this.updatedAt = obj.updatedAt;
    this.likes = obj.likes;
    this.dislikes = obj.dislikes;
  }
}

interface IPersonInfo {
  name: string;
  avatar: string;
}

export class FullPostEntity extends PostEntity {
  topicInfo?: IPersonInfo;
  authorInfo: IPersonInfo;
  commentsCount: number;

  constructor(
    obj: PostModel &
      ITimestaps & {
        _id: ObjectId;
        topicInfo?: IPersonInfo;
        commentsCount: number;
        authorInfo: IPersonInfo;
      },
  ) {
    super(obj);
    this.commentsCount = obj.commentsCount;
    this.authorInfo = obj.authorInfo;
    this.topicInfo = obj.topicInfo;
  }
}
