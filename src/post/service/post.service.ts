import { ObjectId } from 'mongodb';
import { CommunityEntity } from './../../community/entity/community.entity';
import { Model } from 'mongoose';
import { ApiError } from '../../error/custom-error';
import { PostModel, PostModelDocument } from './../model/post.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { FullPostEntity, PostEntity } from '../entity/post.entity';
import { TYPE_ERROR } from '../../error/custom-error.interface';
import {
  createClassesObject,
  getInfoLikesAndDislikes,
} from '../../common/helper-function';
import { SearchPostDto } from '../dto/search-post.dto';
import { UserService } from 'src/user/service/user.service';
import { CommunityService } from 'src/community/service/community.service';
import { CommentService } from 'src/comment/service/comment.service';
import { IPostModels } from './post-service.interface';
import { JwtService } from '@nestjs/jwt';
import { CONFIG_AUTH } from 'src/auth/auth.config';
import { IJwtData } from 'src/auth/strategies/jwt-strategy';
import { GetPostsFromFeedDto } from '../dto/get-posts-from-feed.dto';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(NAME_MODEL_ENUM.POST)
    private readonly postModel: Model<PostModelDocument>,
    private readonly userService: UserService,
    private readonly communityService: CommunityService,
    private readonly commentService: CommentService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreatePostDto, id: ObjectId) {
    const post = await this.postModel.create({ ...dto, author: id });
    if (!post)
      throw new ApiError(500, ['post not created'], TYPE_ERROR.INTERNAL_SERVER);

    if (post.topic) await this.communityService.changeRating(post.topic, 'low');

    await this.userService.changeRating(id, 'low');
    return new PostEntity({
      _id: post.id,
      title: post.title,
      author: post.author,
      body: post.body,
      createdAt: post.createdAt,
      updatedAt: post.createdAt,
      dislikes: post.dislikes,
      likes: post.likes,
      topic: post.topic,
      views: post.views,
    });
  }

  async incrementRating(id: ObjectId) {
    await this.userService.changeRating(id, 'low');
    return {
      success: true,
    };
  }

  private async collectFullPosts(posts: IPostModels[]) {
    for (const post of posts) {
      const author = await this.userService.findById(post.author);
      if (post.topic) {
        const topic = await this.communityService.findById(post.topic);
        post.topicInfo = {
          avatar: topic.avatar,
          name: topic.title,
        };
      }
      const comments = await this.commentService.findMany({
        post: post._id,
      });
      post.commentsCount = comments.length;
      post.authorInfo = {
        avatar: author.avatar,
        name: author.fullName,
      };
    }
    return createClassesObject(FullPostEntity, posts) as FullPostEntity[];
  }

  async getNewPosts() {
    const allPosts = await this.postModel
      .find()
      .sort({ $natural: -1 })
      .limit(15);
    if (!allPosts)
      throw new ApiError(404, ['posts not found'], TYPE_ERROR.NOT_FOUND);

    return await this.collectFullPosts(allPosts);
  }

  async clean() {
    return await this.postModel.remove({});
  }

  async search(dto: SearchPostDto) {
    const queryParams: { [key: string]: any } = {};
    const sortParams: { [key: string]: any } = {};
    if (dto.views) {
      sortParams.views = dto.views; //1 ?????? -1
    }
    if (dto.new) {
      sortParams.$natural = dto.new;
    }
    if (dto.title) queryParams.title = { $regex: dto.title, $options: 'i' };
    if (dto.body) queryParams.body = { $regex: dto.body, $options: 'i' };
    if (dto.tags) queryParams.tags = { $regex: dto.tags, $options: 'i' };
    const posts = await this.postModel
      .find(queryParams)
      .limit(dto.limit)
      .skip(dto.skip)
      .sort(sortParams);

    return await this.collectFullPosts(posts);
  }

  async getPostsPerson(id: ObjectId) {
    const posts = await this.postModel.find({ author: id }).sort({ _id: -1 });
    if (!posts.length) return [];
    return this.collectFullPosts(posts);
  }

  async getPopularPosts() {
    const posts = await this.postModel.find().sort({ views: -1 });
    if (!posts)
      throw new ApiError(404, ['posts not found'], TYPE_ERROR.NOT_FOUND);
    return await this.collectFullPosts(posts);
  }

  async getPostsFromFeed(dto: GetPostsFromFeedDto, id: ObjectId) {
    const sortParams: { [key: string]: any } = {};
    const user = await this.userService.findOne({ _id: id });
    if (!user)
      throw new ApiError(404, ['user not found'], TYPE_ERROR.NOT_FOUND);
    if (dto.popular) {
      sortParams.views = dto.popular; //1 ?????? -1
    }
    if (dto.new) {
      sortParams.$natural = dto.new;
    }
    const posts = await this.postModel
      .find({
        $or: [
          { author: { $in: user.subscriptionBlogs } },
          { topic: { $in: user.subscriptionCommunities } },
        ],
        $nor: [{ author: user._id }],
      })

      .sort(sortParams)
      .skip(dto.skip)
      .limit(dto.limit);
    return await this.collectFullPosts(posts);
  }

  async findOne(id: ObjectId, token: string) {
    const user = await this.validateToken(token);
    const post = await this.postModel.findById(id);
    if (!post)
      throw new ApiError(404, ['post not found'], TYPE_ERROR.NOT_FOUND);
    if (user) await this.incrementViews(user.id, post.views, post._id);
    const posts = await this.collectFullPosts([post]);
    return posts[0];
  }

  async setLike(userId: ObjectId, postId: ObjectId) {
    let post = await this.postModel.findById(postId);
    if (!post.likes.includes(userId)) {
      post = await this.postModel.findByIdAndUpdate(
        postId,
        {
          $push: { likes: userId },
          $pull: { dislikes: userId },
        },
        { new: true },
      );
      await this.userService.changeRating(userId, 'middle');
      if (post.topic)
        await this.communityService.changeRating(post.topic, 'middle');
    } else {
      post = await this.postModel.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
        },
        {
          new: true,
        },
      );
      if (post.topic)
        await this.communityService.changeRating(post.topic, 'middle', true);
      await this.userService.changeRating(userId, 'middle', true);
    }
    return getInfoLikesAndDislikes(post);
  }

  async setDislike(userId: ObjectId, postId: ObjectId) {
    let post = await this.postModel.findById(postId);
    if (post.dislikes.includes(userId)) {
      post = await this.postModel.findByIdAndUpdate(
        postId,
        {
          $pull: { dislikes: userId },
        },
        { new: true },
      );
      await this.userService.changeRating(userId, 'middle');
      if (post.topic)
        await this.communityService.changeRating(post.topic, 'middle');
    } else {
      post = await this.postModel.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
          $push: { dislikes: userId },
        },
        { new: true },
      );
      await this.userService.changeRating(userId, 'middle', true);
      if (post.topic)
        await this.communityService.changeRating(post.topic, 'middle', true);
    }
    return getInfoLikesAndDislikes(post);
  }

  private async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: CONFIG_AUTH.ACCESS_JWT_SECRET_KEY,
      });
    } catch (e) {
      return null;
    }
  }

  private async incrementViews(
    userId: ObjectId,
    views: ObjectId[],
    postId: ObjectId,
  ) {
    const post = await this.postModel.findById(postId);
    if (!views.includes(userId)) {
      await this.userService.changeRating(post.author, 'low');
      if (post.topic)
        await this.communityService.changeRating(post.topic, 'low');
      return (
        await this.postModel.findByIdAndUpdate(postId, {
          $push: { views: userId },
        }),
        { new: true }
      );
    }
  }

  async update(id: ObjectId, dto: UpdatePostDto) {
    const post = await this.postModel.findByIdAndUpdate(id, dto, { new: true });
    if (!post)
      throw new ApiError(404, ['post not found'], TYPE_ERROR.NOT_FOUND);
    return new PostEntity(post);
  }

  async deleteOne(id: ObjectId) {
    const removedPost = await this.postModel.findByIdAndRemove(id);
    return new PostEntity(removedPost);
  }
}
