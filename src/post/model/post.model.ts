import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type PostModelDocument = PostModel & Document;
@Schema({ collection: 'posts', timestamps: true })
export class PostModel {
  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: 0 })
  views: number;

  createdAt: string;
  updatedAt: string;
}

export const PostModelSchema = SchemaFactory.createForClass(PostModel);
