import { Document, Types } from 'mongoose';
import { PostEntity } from '../entity/post.entity';
export interface IPersonInfo {
  name: string;
  avatar: string;
}

export interface IPostModels extends PostEntity {
  topicInfo?: IPersonInfo;
  authorInfo?: IPersonInfo;
  commentsCount?: number;
}
