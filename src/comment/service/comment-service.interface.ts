import { ObjectId } from 'mongodb';
import { IPersonInfo } from 'src/post/service/post-service.interface';
import { CommentEntity } from '../entity/comment.entity';

export interface IFindOneComment {
  post?: ObjectId;
  user?: ObjectId;
}
export interface ICommentModels extends CommentEntity {
  userInfo?: IPersonInfo;
  countSubComments?: number;
}
