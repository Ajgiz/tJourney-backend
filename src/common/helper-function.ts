import { CommunityEntity } from './../community/entity/community.entity';
import { CommentModel } from 'src/comment/model/comment.model';
import { UserModel } from './../user/model/user.model';
import { PostModel } from './../post/model/post.model';
import { CommentEntity } from 'src/comment/entity/comment.entity';
import { PostEntity } from 'src/post/entity/post.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { CommunityModel } from 'src/community/model/community.model';
import { ValidationError } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ConstructorTypeOf<T> = new (...args: any[]) => T;
export type IEntities =
  | PostEntity
  | UserEntity
  | CommentEntity
  | CommunityEntity;
export type AllModelsType =
  | PostModel
  | UserModel
  | CommentModel
  | CommunityModel;

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

export const collectMessagesError = (messages: ValidationError[]) => {
  const messagesError: string[] = [];
  const helper = (value: ValidationError[] | ValidationError) => {
    if (Array.isArray(value)) {
      value.forEach((el) => helper(el));
    } else {
      if (value.constraints)
        Object.values(value.constraints).forEach((el) =>
          messagesError.push(el),
        );
      if (value.children) {
        value.children.forEach((el) => helper(el));
      }
    }
  };
  helper(messages);
  return messagesError;
};
