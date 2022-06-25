import { ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CommentModel } from 'src/comment/model/comment.model';
export type UserModelDocument = UserModel & Document;
@Schema({ collection: 'users' })
export class UserModel {
  @Prop()
  fullName: string;

  @Prop({ default: null })
  password?: string;

  @Prop()
  email: string;

  @Prop()
  avatar: string;
}
export const UserModelSchema = SchemaFactory.createForClass(UserModel);
