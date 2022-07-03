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
import { MongoId } from '../../mongoose.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: IUserModel,
  ) {}

  async create(dto: CreateUserDto) {
    const user = await this.userModel.create(dto);
    if (!user)
      throw new ApiError(
        500,
        { response: 'user not created' },
        TYPE_ERROR.INTERNAL_SERVER,
      );
    return new UserEntity(user);
  }

  async findAll() {
    const allUsers = await this.userModel.find();
    if (!allUsers)
      throw new ApiError(
        500,
        { response: 'users not find' },
        TYPE_ERROR.NOT_FOUND,
      );
    return createClassesObject(UserEntity, allUsers) as UserEntity[];
  }

  async findById(id: MongoId) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new ApiError(
        404,
        { response: 'user not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    }
    return new UserEntity(user);
  }

  async findOne(dto: UpdateUserDto) {
    return await this.userModel.findOne(dto);
  }

  async update(id: MongoId, dto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updatedUser) {
      throw new ApiError(
        404,
        { response: 'user not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    }
    return new UserEntity(updatedUser);
  }

  async deleteOne(id: MongoId) {
    const deletedUser = await this.userModel.findByIdAndRemove(id);
    if (!deletedUser) {
      throw new ApiError(
        404,
        { response: 'user not found' },
        TYPE_ERROR.NOT_FOUND,
      );
    }
    return new UserEntity(deletedUser);
  }
}
