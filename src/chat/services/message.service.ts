import { ObjectId } from 'mongodb';
import { MessageModelDocument } from './../models/message.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
import { createClassesObject } from 'src/common/helper-function';
import { MessageEntity } from '../entities/message.entity';
import { CreateMessageDto } from '../gateway/dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(NAME_MODEL_ENUM.MESSAGE)
    private messageModel: Model<MessageModelDocument>,
  ) {}
  async create(dto: CreateMessageDto, from: ObjectId) {
    const message = await this.messageModel.create({
      ...dto,
      from,
    });
    return new MessageEntity(message);
  }
  async getMany(id: ObjectId) {
    const messages = await this.messageModel.find({ chat: id });
    return createClassesObject(MessageEntity, messages) as MessageEntity[];
  }
}
