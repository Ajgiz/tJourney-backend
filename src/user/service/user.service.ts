import { RatingScheduleService } from './../../rating-schedule/rating-schedule.service';
import { UserModelDocument } from './../model/user.model';
import { createClassesObject } from '../../common/helper-function';
import { TYPE_ERROR } from '../../error/custom-error.interface';
import { ApiError } from '../../error/custom-error';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserModel } from '../model/user.model';
import { FullUserEntity, UserEntity } from '../entity/user.entity';
import { ObjectId } from 'mongodb';
import { IFindOneUser, LevelIncrementRating } from './user-service.interface';
import { PeriodRatingType } from '../dto/get-rating-users';
import { Model } from 'mongoose';
import { calcTimeUntilNextPoint } from 'src/common/time';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(NAME_MODEL_ENUM.USER)
    private readonly userModel: Model<UserModelDocument>,
    private readonly ratingScheduleService: RatingScheduleService,
  ) {}
  async onModuleInit() {
    const users = await this.userModel.find({});
    for (const user of users) {
      if (this.ratingScheduleService.getTimeout(`${user.fullName}-month`))
        // если нету месячного, значит нету и другого
        this.insertTimeoutsForUpdateRating(user.fullName, user.id);
    }
  }

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    if (!user)
      throw new ApiError(500, ['user not created'], TYPE_ERROR.INTERNAL_SERVER);
    this.insertTimeoutsForUpdateRating(user.fullName, user._id);
    return new UserEntity(user);
  }

  async insertTimeoutsForUpdateRating(name: string, id: ObjectId) {
    const callbackForUpdateRating = (name: string, count: number) => {
      const callback = () => {
        if (count === 1)
          this.userModel.findByIdAndUpdate(id, {
            'rating.month': 0,
          });
        if (count === 3)
          this.userModel.findByIdAndUpdate(id, {
            'rating.threeMonth': 0,
          });
      };
      this.ratingScheduleService.addTimeout(
        name,
        callback,
        calcTimeUntilNextPoint(new Date().getTime(), count),
      );
    };
    callbackForUpdateRating(`${name}-month`, 1);
    callbackForUpdateRating(`${name}-three-month`, 3);
  }

  async findAll() {
    const allUsers = await this.userModel.find();
    if (!allUsers)
      throw new ApiError(500, ['users not find'], TYPE_ERROR.NOT_FOUND);
    return createClassesObject(UserEntity, allUsers) as UserEntity[];
  }

  async getMe(id: ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new ApiError(404, ['user not found'], TYPE_ERROR.NOT_FOUND);
    }
    const subscribersInfo = await this.findMySubscribe(user.subscribers);

    return {
      ...new UserEntity(user),
      subscribersInfo,
    };
  }

  async findMySubscribe(subscribers: ObjectId[]) {
    const users = await this.userModel
      .find({ _id: { $in: subscribers } })
      .select({ fullName: 1, avatar: 1, _id: 1 });
    return users.map((user) => ({
      name: user.fullName,
      avatar: user.avatar,
      _id: user._id,
    }));
  }

  async findById(id: ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user)
      throw new ApiError(404, ['user not found'], TYPE_ERROR.NOT_FOUND);
    const subscribersInfo = await this.findMySubscribe(user.subscribers);
    return {
      ...new UserEntity(user),
      subscribersInfo,
    };
  }
  async getRatings(period: PeriodRatingType) {
    let rating: { [key: string]: any } = { 'rating.allTime': -1 };
    if (period === 'month') rating = { 'rating.month': -1 };
    if (period === 'three-month') rating = { 'rating.threeMonth': -1 };
    const users = await this.userModel
      .find({})
      .sort(rating)
      .limit(period === 'month' ? 15 : period === 'three-month' ? 50 : 100);
    return createClassesObject(UserEntity, users) as UserEntity[];
  }

  async findOne(dto: IFindOneUser) {
    return await this.userModel.findOne(dto);
  }

  async changeRating(
    id: ObjectId,
    level: LevelIncrementRating,
    decrease?: boolean,
  ) {
    let value = level === 'low' ? 1 : level === 'middle' ? 2 : 3;
    if (decrease) value = -value;
    await this.userModel.findByIdAndUpdate(id, {
      $inc: {
        'rating.allTime': value,
        'rating.month': value,
        'rating.threeMonth': value,
      },
    });
  }

  async getSubscriptionsOnBlogs(id: ObjectId) {
    const subscribeBlogs = await this.userModel.find({
      subscribers: { $in: [id] },
    });
    return createClassesObject(UserEntity, subscribeBlogs) as UserEntity[];
  }

  async subscriptionOnCommunity(id: ObjectId, userId: ObjectId) {
    const user = await this.userModel.findById(userId);
    if (user.subscriptionCommunities.includes(id)) {
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $pull: { subscriptionCommunities: id },
          },
          { new: true },
        )
        .select({ subscriptionCommunities: 1 });
    } else
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $push: { subscriptionCommunities: id },
          },
          { new: true },
        )
        .select({ subscriptionCommunities: 1 });
  }

  async subscription(id: ObjectId, userId: ObjectId) {
    const user = await this.userModel.findById(userId);
    if (user.subscriptionBlogs.includes(id)) {
      await this.userModel.findByIdAndUpdate(id, {
        $pull: { subscribers: userId },
      });
      await this.changeRating(id, 'high', true);
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $pull: { subscriptionBlogs: id },
          },
          { new: true },
        )
        .select({ subscriptionBlogs: 1 });
    } else {
      await this.userModel.findByIdAndUpdate(id, {
        $push: { subscribers: userId },
      });
      await this.changeRating(id, 'high');
      return await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $push: { subscriptionBlogs: id },
          },
          { new: true },
        )
        .select({ subscriptionBlogs: 1 });
    }
  }

  async update(id: ObjectId, dto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updatedUser) {
      throw new ApiError(404, ['user not found'], TYPE_ERROR.NOT_FOUND);
    }
    return new UserEntity(updatedUser);
  }

  async deleteOne(id: ObjectId) {
    const deletedUser = await this.userModel.findByIdAndRemove(id);
    if (!deletedUser) {
      throw new ApiError(404, ['user not found'], TYPE_ERROR.NOT_FOUND);
    }
    return new UserEntity(deletedUser);
  }
}
