import { CommentModel } from './../model/comment.model';
import { ITimestaps } from '../../mongoose.interface';
import { ObjectId } from 'mongodb';
import { IPersonInfo } from 'src/post/service/post-service.interface';

export class CommentEntity {
  text: string;
  user: ObjectId;
  _id: ObjectId;
  post: ObjectId;
  createdAt: string;
  likes: ObjectId[];
  dislikes: ObjectId[];
  updatedAt: string;
  parent: ObjectId;

  constructor(obj: CommentModel & ITimestaps & { _id: ObjectId }) {
    this._id = obj._id;
    this.text = obj.text;
    this.user = obj.user;
    this.post = obj.post;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.parent = obj.parent;
    this.likes = obj.likes;
    this.dislikes = obj.dislikes;
  }
}

export class FullCommentEntity extends CommentEntity {
  userInfo: IPersonInfo;
  countSubComments: number;
  constructor(
    obj: CommentModel &
      ITimestaps & {
        _id: ObjectId;
        userInfo: IPersonInfo;
        countSubComments: number;
      },
  ) {
    super(obj);
    this.userInfo = obj.userInfo;
    this.countSubComments = obj.countSubComments;
  }
}
