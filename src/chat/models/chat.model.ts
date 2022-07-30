import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

export type ChatModelDocument = Document & ChatModel;

@Schema({ collection: NAME_MODEL_ENUM.CHAT })
export class ChatModel {
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  members: ObjectId[];

  @Prop({ default: true })
  isNotify: boolean;
}
export const ChatModelSchema = SchemaFactory.createForClass(ChatModel);
