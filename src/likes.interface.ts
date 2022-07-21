import { ObjectId } from 'mongodb';
export interface IPayloadLikesAndDislikes {
  _id: ObjectId;
  likes: ObjectId[];
  dislikes: ObjectId[];
}
