import { createClassesObject } from '../../common/helper-function';
import { TYPE_ERROR } from '../../error/custom-error.interface';
import { ApiError } from '../../error/custom-error';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserModel } from '../model/user.interface';
import { UserModel } from '../model/user.model';
import { UserEntity } from '../entity/user.entity';
import { ObjectId } from 'mongodb';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: IUserModel,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    if (!user)
      throw new ApiError(500, ['user not created'], TYPE_ERROR.INTERNAL_SERVER);
    return new UserEntity(user);
  }

  async findAll() {
    const allUsers = await this.userModel.find();
    if (!allUsers)
      throw new ApiError(500, ['users not find'], TYPE_ERROR.NOT_FOUND);
    return createClassesObject(UserEntity, allUsers) as UserEntity[];
  }

  async findById(id: ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new ApiError(404, ['user not found'], TYPE_ERROR.NOT_FOUND);
    }
    return new UserEntity(user);
  }

  async findOne(dto: UpdateUserDto) {
    return await this.userModel.findOne(dto);
  }

  async subscribeCommunity(id: ObjectId, userId: ObjectId) {
    const user = await this.userModel.findById(userId);
    if (user.subscriptionCommunities.includes(id)) {
      user.subscriptionCommunities = user.subscriptionCommunities.filter(
        (s) => s !== id,
      );
    } else user.subscriptionCommunities.push(id);
    await user.save();
    return new UserEntity(user);
  }

  async subscribeBlog(id: ObjectId, userId: ObjectId) {
    const user = await this.userModel.findById(userId);
    if (user.subscriptionBlogs.includes(id)) {
      user.subscriptionBlogs = user.subscriptionBlogs.filter((s) => s !== id);
    } else user.subscriptionBlogs.push(id);
    await user.save();
    return new UserEntity(user);
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
