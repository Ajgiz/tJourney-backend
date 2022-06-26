import { ObjectId, Model } from 'mongoose';
import { ApiError } from 'src/error/custom-error';
import { PostModel, PostModelDocument } from './../model/post.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../entity/post.entity';
import { TYPE_ERROR } from 'src/error/custom-error.interface';
import { createClassesObject } from 'src/common/helper-function';
import { SearchPostDto } from '../dto/search-post.dto';
import { MongoId } from 'src/mongoose.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModelDocument>,
  ) {}

  async create(dto: CreatePostDto) {
    const post = await this.postModel.create(dto);
    if (!post)
      throw new ApiError(
        500,
        { repsonse: 'post not created' },
        TYPE_ERROR.INTERNAL_SERVER,
      );
    return new PostEntity(post);
  }

  async findAllNew() {
    const allPosts = await this.postModel.find().sort({ $natural: -1 });
    if (!allPosts)
      throw new ApiError(
        404,
        { response: 'posts not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return createClassesObject(PostEntity, allPosts) as PostEntity[];
  }

  async clean() {
    return await this.postModel.remove({});
  }

  async search(dto: SearchPostDto) {
    const queryParams: { [key: string]: any } = {};
    const sortParams: { [key: string]: any } = {};
    if (dto.views) {
      sortParams.views = dto.views;
    }
    if (dto.new) {
      sortParams.$natural = dto.new;
    }
    if (dto.title) queryParams.title = { $regex: dto.title, $options: 'i' };
    if (dto.body) queryParams.body = { $regex: dto.body, $options: 'i' };
    if (dto.tags) queryParams.tags = { $regex: dto.tags, $options: 'i' };
    const posts = await this.postModel
      .find(queryParams)
      .limit(dto.limit || 10)
      .skip(dto.take || 0)
      .sort(sortParams);
    if (!posts)
      throw new ApiError(
        404,
        { response: 'posts not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return createClassesObject(PostEntity, posts) as PostEntity[];
  }

  async findPopularPosts() {
    const allPosts = await this.postModel.find().sort({ views: -1 });
    if (!allPosts)
      throw new ApiError(
        404,
        { response: 'posts not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return createClassesObject(PostEntity, allPosts) as PostEntity[];
  }

  async findOne(id: MongoId) {
    const post = await this.postModel.findById(id);
    if (!post)
      throw new ApiError(
        404,
        { response: 'post not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return new PostEntity(await this.incrementViews(post._id));
  }

  async incrementViews(id: MongoId) {
    return await this.postModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );
  }

  async update(id: MongoId, dto: UpdatePostDto) {
    const post = await this.postModel.findByIdAndUpdate(id, dto, { new: true });
    if (!post)
      throw new ApiError(
        404,
        { response: 'post not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    return new PostEntity(post);
  }

  async deleteOne(id: MongoId) {
    const removedPost = await this.postModel.findByIdAndRemove(id);
    return new PostEntity(removedPost);
  }
}
