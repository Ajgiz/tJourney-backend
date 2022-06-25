import { createClassesObject } from 'src/common/helper-function';
import { CommentEntity } from './../entity/comment.entity';
import { CommentModel } from './../model/comment.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Model, ObjectId } from 'mongoose';
import { CommentModelDocument } from '../model/comment.model';
import { ApiError } from 'src/error/custom-error';
import { TYPE_ERROR } from 'src/error/custom-error.interface';
@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentModel.name)
    private commentModel: Model<CommentModelDocument>,
  ) {}

  async create(dto: CreateCommentDto) {
    const comment = await this.commentModel.create(dto);
    if (!comment)
      throw new ApiError(
        500,
        { repsonse: 'comment not created' },
        TYPE_ERROR.INTERNAL_SERVER,
      );
    return new CommentEntity(comment);
  }

  async findAll() {
    const allComments = await this.commentModel.find();
    if (!allComments)
      throw new ApiError(
        404,
        { repsonse: 'comments not created' },
        TYPE_ERROR.NOT_FOUND,
      );
    return createClassesObject(CommentEntity, allComments) as CommentEntity[];
  }

  async findOne(id: ObjectId) {
    const comment = await this.commentModel.findById(id);
    if (!comment)
      throw new ApiError(
        404,
        { repsonse: 'comments not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return new CommentEntity(comment);
  }

  async update(id: ObjectId, dto: UpdateCommentDto) {
    const comment = await this.commentModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!comment)
      throw new ApiError(
        404,
        { repsonse: 'comments not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return new CommentEntity(comment);
  }

  async deleteOne(id: ObjectId) {
    const deletedComment = await this.commentModel.findByIdAndRemove(id);
    if (!deletedComment)
      throw new ApiError(
        404,
        { repsonse: 'comments not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return new CommentEntity(deletedComment);
  }
}
