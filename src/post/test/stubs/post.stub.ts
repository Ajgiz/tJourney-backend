import { ObjectId } from 'mongodb';
import { PostModel } from './../../model/post.model';

export const postStub = (): Omit<PostModel, 'createdAt' | 'updatedAt'> => {
  return {
    body: [],
    topic: new ObjectId(12),
    title: 'WebScoket & Postman',
    views: [],
    author: null,
    dislikes: [],
    likes: [],
  };
};
