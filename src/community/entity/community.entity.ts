import { IRatingStatistics } from './../../user/model/user.interface';
import { ObjectId } from 'mongodb';
import { CommunityModel } from '../model/community.model';

export class CommunityEntity {
  title: string;
  description: string;
  cover?: string;
  subscribers: ObjectId[];
  avatar?: string;
  author: ObjectId;
  rating: IRatingStatistics;

  _id: ObjectId;
  constructor(obj: CommunityModel & { _id: ObjectId }) {
    this.avatar = obj.avatar;
    this.description = obj.description;
    this.subscribers = obj.subscribers;
    this.cover = obj.cover;
    this.title = obj.title;
    this.author = obj.author;
    this._id = obj._id;
    this.rating = obj.rating;
  }
}
