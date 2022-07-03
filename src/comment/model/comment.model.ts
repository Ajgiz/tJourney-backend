import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoId } from '../../mongoose.interface';

export type CommentModelDocument = Document & CommentModel;
@Schema({ collection: 'comments', timestamps: true })
export class CommentModel {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: MongoId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'posts' })
  post: MongoId;

  createdAt: string;
  updatedAt: string;
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);
