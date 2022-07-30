import { ObjectId } from 'mongodb';
import { ChatModel } from './../models/chat.model';
export class ChatEntity {
  members: ObjectId[];
  isNotify: boolean;
  _id: ObjectId;
  constructor(obj: ChatModel & { _id: ObjectId }) {
    this.members = obj.members;
    this._id = obj._id;
    this.isNotify = obj.isNotify;
  }
}
