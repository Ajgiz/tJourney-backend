import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoId } from 'src/mongoose.interface';

export type TokenModelDocument = Document & TokenModel;
@Schema({ collection: 'tokens' })
export class TokenModel {
  @Prop()
  refreshToken: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: MongoId;
}

export const TokenModelSchema = SchemaFactory.createForClass(TokenModel);
