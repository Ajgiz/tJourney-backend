import { ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CommentModel } from 'src/comment/model/comment.model';
export type UserModelDocument = UserModel & Document;
@Schema({ collection: 'users' })
export class UserModel {
  @Prop({ required: true })
  fullName: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: '' })
  avatar: string;
}
export const UserModelSchema = SchemaFactory.createForClass(UserModel);
