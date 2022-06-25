import { CommentModel } from 'src/comment/model/comment.model';
import { UserModel } from './../user/model/user.model';
import { PostModel } from './../post/model/post.model';
import { CommentEntity } from 'src/comment/entity/comment.entity';
import { PostEntity } from 'src/post/entity/post.entity';
import { UserEntity } from 'src/user/entity/user.entity';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ConstructorTypeOf<T> = new (...args: any[]) => T;
export type IEntities = PostEntity | UserEntity | CommentEntity;
export type AllModelsType = PostModel | UserModel | CommentModel;

export function createClassesObject(
  Class: ConstructorTypeOf<IEntities>,
  obj: AllModelsType[],
) {
  const result: IEntities[] = [];
  obj.forEach((el) => {
    result.push(new Class(el));
  });
  return result;
}
