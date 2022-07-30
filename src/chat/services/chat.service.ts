import { ChatEntity } from './../entities/chat.entity';
import { ChatModelDocument } from './../models/chat.model';
import { Injectable } from '@nestjs/common';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/user/service/user.service';
import { MessageService } from './message.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(NAME_MODEL_ENUM.CHAT)
    private chatModel: Model<ChatModelDocument>,
    private userService: UserService,
    private messageService: MessageService,
  ) {}
  async create(to: ObjectId, from: ObjectId) {
    const members = [to, from];
    let chat = await this.chatModel.findOne({ members: { $all: members } });
    if (!chat)
      chat = await this.chatModel.create({
        members,
      });
    const messages = await this.messageService.getMany(chat._id);
    const receiver = await this.userService.findOne({ _id: to });
    return {
      chat,
      messages,
      receiver,
    };
  }
}
