import mongoose, { ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentModelDocument = Document & CommentModel;
@Schema({ collection: 'comments', timestamps: true })
export class CommentModel {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'posts' })
  post: ObjectId;
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);
