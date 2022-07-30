import { ObjectId } from 'mongodb';
export interface IOnlineUsers {
  socketId: string;
  userId: ObjectId;
}
