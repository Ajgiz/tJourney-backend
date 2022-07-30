import { ObjectId } from 'mongodb';
import { MessageModel } from '../models/message.model';

export class MessageEntity {
  from: ObjectId;
  to: ObjectId;
  body: string;
  _id: ObjectId;
  createdAt: string;
  updatedAt: string;
  chat: ObjectId;

  constructor(obj: MessageModel & { _id: ObjectId }) {
    this._id = obj._id;
    this.body = obj.body;
    this.from = obj.from;
    this.to = obj.to;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.chat = obj.chat;
  }
}
