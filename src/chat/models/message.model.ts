import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
export type MessageModelDocument = Document & MessageModel;

@Schema({ collection: NAME_MODEL_ENUM.MESSAGE, timestamps: true })
export class MessageModel {
  @Prop({ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER })
  from: ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER })
  to: ObjectId;

  @Prop()
  body: string;

  createdAt: string;
  updatedAt: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.CHAT })
  chat: ObjectId;
}
export const MessageModelSchema = SchemaFactory.createForClass(MessageModel);
