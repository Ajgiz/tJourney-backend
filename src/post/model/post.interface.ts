import { Model, ObjectId } from 'mongoose';
import { PostModelDocument } from './post.model';

export type PostModel = Model<PostModelDocument>;
