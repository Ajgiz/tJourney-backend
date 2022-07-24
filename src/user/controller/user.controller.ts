import { ObjectId } from 'mongodb';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UsePipes,
  UseFilters,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CustomExceptionFilter } from '../../exception/custom-exception';
import { IsObjectIdParam } from '../../custom-decorators/validation-mongoose.object-id.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-guards';
import { Request } from 'express';
import { GetUser } from 'src/custom-decorators/get-user.decorator';
import { IJwtData } from 'src/auth/strategies/jwt-strategy';
import { GetUsersRatingDto } from '../dto/get-rating-users';

@UseFilters(CustomExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  getProfile(@GetUser() user: IJwtData) {
    return this.userService.getMe(user._id);
  }

  @Get('subscriptions-blogs/:id')
  async getSubscriptionsOnBlogs(@IsObjectIdParam() id: ObjectId) {
    return await this.userService.getSubscriptionsOnBlogs(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/update')
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const { _id } = req.user;
    return this.userService.update(_id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  remove(@Req() req: Request) {
    return this.userService.deleteOne(req.user._id);
  }

  @Get('users-rating')
  async getUsersRating(@Query() dto: GetUsersRatingDto) {
    return await this.userService.getUsersRating(dto.period);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('subscription/:id')
  async subscription(
    @IsObjectIdParam() id: ObjectId,
    @GetUser() user: IJwtData,
  ) {
    return await this.userService.subscription(id, user._id);
  }

  @Get(':id')
  findOne(@IsObjectIdParam() id: ObjectId) {
    return this.userService.findById(id);
  }
}
