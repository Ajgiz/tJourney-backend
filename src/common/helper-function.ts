import { ChatModel } from './../chat/models/chat.model';
import { PeriodRatingType } from './../user/dto/get-rating-users';
import { ObjectId } from 'mongodb';
import { CommunityEntity } from './../community/entity/community.entity';
import { CommentModel } from 'src/comment/model/comment.model';
import { UserModel } from './../user/model/user.model';
import { PostModel } from './../post/model/post.model';
import { CommentEntity } from 'src/comment/entity/comment.entity';
import { PostEntity } from 'src/post/entity/post.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { CommunityModel } from 'src/community/model/community.model';
import { ValidationError } from 'class-validator';
import { IPayloadLikesAndDislikes } from 'src/likes.interface';
import { MessageModel } from 'src/chat/models/message.model';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { MessageEntity } from 'src/chat/entities/message.entity';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ConstructorTypeOf<T> = new (...args: any[]) => T;
export type IEntities =
  | PostEntity
  | UserEntity
  | CommentEntity
  | CommunityEntity
  | ChatEntity
  | MessageEntity;

export type AllModelsType =
  | PostModel
  | UserModel
  | CommentModel
  | CommunityModel
  | MessageModel
  | ChatModel;

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

export const getInfoLikesAndDislikes = ({
  _id,
  dislikes,
  likes,
}: IPayloadLikesAndDislikes) => {
  return {
    _id,
    likes,
    dislikes,
  };
};
