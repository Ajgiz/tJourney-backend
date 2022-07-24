import { ApiError } from './../../error/custom-error';
import { CommunityEntity } from './../entity/community.entity';
import { CommunityModel } from './../model/community.model';
import { CreateCommunityDto } from './../dto/create-community.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityModelDocument } from '../model/community.model';
import { ObjectId } from 'mongodb';
import { TYPE_ERROR } from 'src/error/custom-error.interface';
import { UserService } from 'src/user/service/user.service';
import { SearchCommunityDto } from '../dto/search-community.dto';
import { createClassesObject } from 'src/common/helper-function';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(CommunityModel.name)
    private readonly communityModel: Model<CommunityModelDocument>,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateCommunityDto, author: ObjectId) {
    const community = await this.communityModel.create({ ...dto, author });
    return new CommunityEntity(community);
  }

  async getMyCommunity(userId: ObjectId) {
    const myCommunities = await this.communityModel.find({ author: userId });
    if (!myCommunities)
      throw new ApiError(404, ['communities not found'], TYPE_ERROR.NOT_FOUND);
    return createClassesObject(
      CommunityEntity,
      myCommunities,
    ) as CommunityEntity[];
  }

  async getSubscriptionsOnCommunity(userId: ObjectId) {
    const subscriberCommunities = await this.communityModel.find({
      subscribers: { $in: [userId] },
    });
    if (!subscriberCommunities)
      throw new ApiError(404, ['communities not found'], TYPE_ERROR.NOT_FOUND);
    return createClassesObject(
      CommunityEntity,
      subscriberCommunities,
    ) as CommunityEntity[];
  }

  async search(dto: SearchCommunityDto) {
    const queryParams: { [key: string]: any } = {};
    if (dto.title) queryParams.title = { $regex: dto.title, $options: 'i' };
    if (dto.email) {
      const user = await this.userService.findOne({ email: dto.email });
      queryParams.subscribers = { $nin: [user._id] };
      queryParams.author = { $nin: [user._id] };
    }

    if (dto.description)
      queryParams.description = { $regex: dto.description, $options: 'i' };
    const communities = await this.communityModel
      .find(queryParams)
      .skip(dto.skip)
      .limit(dto.limit);

    return createClassesObject(
      CommunityEntity,
      communities,
    ) as CommunityEntity[];
  }

  async subsciption(id: ObjectId, userId: ObjectId) {
    const community = await this.communityModel.findById(id);
    if (!community)
      throw new ApiError(404, ['community not found'], TYPE_ERROR.NOT_FOUND);

    if (community.subscribers.includes(userId)) {
      await this.communityModel
        .findByIdAndUpdate(
          id,
          {
            $pull: { subscribers: userId },
          },
          { new: true },
        )
        .select({ subscribers: 1 });
    } else
      await this.communityModel
        .findByIdAndUpdate(
          id,
          {
            $push: { subscribers: userId },
          },
          { new: true },
        )
        .select({ subscribers: 1 });
    return await this.userService.subscriptionOnCommunity(id, userId);
  }

  async findById(id: ObjectId) {
    const community = await this.communityModel.findById(id);
    if (!community)
      throw new ApiError(404, ['community not found'], TYPE_ERROR.NOT_FOUND);
    return new CommunityEntity(community);
  }
}
