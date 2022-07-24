import { ObjectId } from 'mongodb';

export interface IPayloadJwt {
  email: string;
  fullName: string;
  id: ObjectId;
  subscriptionBlogs: ObjectId[];
  subscriptionCommunities: ObjectId[];
}
