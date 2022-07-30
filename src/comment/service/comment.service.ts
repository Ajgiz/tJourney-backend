import {
  createClassesObject,
  getInfoLikesAndDislikes,
} from '../../common/helper-function';
import { CommentEntity, FullCommentEntity } from './../entity/comment.entity';
import { CommentModel } from './../model/comment.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CommentModelDocument } from '../model/comment.model';
import { ApiError } from '../../error/custom-error';
import { TYPE_ERROR } from '../../error/custom-error.interface';
import { ICommentModels, IFindOneComment } from './comment-service.interface';
import { GetCommentsDto } from '../dto/get-comments.dto';
import { UserService } from 'src/user/service/user.service';
import { CommunityService } from 'src/community/service/community.service';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(NAME_MODEL_ENUM.COMMENT)
    private commentModel: Model<CommentModelDocument>,
    private communityService: CommunityService,
    private userService: UserService,
  ) {}

  async create(dto: CreateCommentDto, user: ObjectId) {
    const comment = await this.commentModel.create({ ...dto, user });
    if (!comment)
      throw new ApiError(
        500,
        ['comment not created'],
        TYPE_ERROR.INTERNAL_SERVER,
      );
    const comments = await this.getFullComments([comment]);
    await this.userService.changeRating(user, 'low');
    return comments[0];
  }

  async getUserComments(id: ObjectId) {
    const comments = await this.commentModel.find({ user: id });
    return createClassesObject(CommentEntity, comments);
  }

  async setLike(userId: ObjectId, id: ObjectId) {
    let comment = await this.commentModel.findById(id);
    if (!comment.likes.includes(userId)) {
      comment = await this.commentModel.findByIdAndUpdate(
        id,
        {
          $push: { likes: userId },
          $pull: { dislikes: userId },
        },
        { new: true },
      );
      await this.userService.changeRating(userId, 'middle');
    } else {
      comment = await this.commentModel.findByIdAndUpdate(
        id,
        {
          $pull: { likes: userId },
        },
        {
          new: true,
        },
      );
      await this.userService.changeRating(userId, 'middle', true);
    }
    return getInfoLikesAndDislikes(comment);
  }

  async setDislike(userId: ObjectId, id: ObjectId) {
    let comment = await this.commentModel.findById(id);
    if (comment.dislikes.includes(userId)) {
      comment = await this.commentModel.findByIdAndUpdate(
        id,
        {
          $pull: { dislikes: userId },
        },
        { new: true },
      );
      await this.userService.changeRating(userId, 'middle', true);
    } else {
      comment = await this.commentModel.findByIdAndUpdate(
        id,
        {
          $pull: { likes: userId },
          $push: { dislikes: userId },
        },
        { new: true },
      );
      await this.userService.changeRating(userId, 'middle');
    }
    return getInfoLikesAndDislikes(comment);
  }

  async getFullComments(comments: ICommentModels[]) {
    for (const comment of comments) {
      const user = await this.userService.findById(comment.user);
      comment.userInfo = {
        avatar: user.avatar,
        name: user.fullName,
      };
      comment.countSubComments = await this.getCountSubComments(comment._id);
    }
    return createClassesObject(
      FullCommentEntity,
      comments,
    ) as FullCommentEntity[];
  }

  async getCountSubComments(parent: ObjectId) {
    return await this.commentModel.find({ parent }).count();
  }

  async findAll({ exclude, limit, parent, post, skip, sort }: GetCommentsDto) {
    const comments = await this.commentModel
      .find({
        parent: parent || null,
        post,
      })
      .where('_id')
      .nin(exclude ? exclude.split(';') : [])
      .skip(skip)
      .limit(limit);

    if (!comments)
      throw new ApiError(404, ['comments not created'], TYPE_ERROR.NOT_FOUND);
    return await this.getFullComments(
      comments.sort((a, b) => {
        if (sort === 'popular') {
          return (
            b.likes.length -
            b.dislikes.length -
            (a.likes.length - a.dislikes.length)
          );
        } else {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      }),
    );
  }

  async findMany(dto: IFindOneComment) {
    const comments = await this.commentModel.find(dto);
    if (!comments)
      throw new ApiError(404, ['comments not found'], TYPE_ERROR.NOT_FOUND);
    return createClassesObject(CommentEntity, comments) as CommentEntity[];
  }

  async findById(id: ObjectId) {
    const comment = await this.commentModel.findById(id);
    if (!comment)
      throw new ApiError(404, ['comments not found'], TYPE_ERROR.NOT_FOUND);
    return new CommentEntity(comment);
  }

  async update(id: ObjectId, dto: UpdateCommentDto) {
    const comment = await this.commentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!comment)
      throw new ApiError(404, ['comments not found'], TYPE_ERROR.NOT_FOUND);
    return new CommentEntity(comment);
  }

  async deleteOne(id: ObjectId) {
    const deletedComment = await this.commentModel.findByIdAndRemove(id);
    if (!deletedComment)
      throw new ApiError(404, ['comments not found'], TYPE_ERROR.NOT_FOUND);
    return new CommentEntity(deletedComment);
  }
}
