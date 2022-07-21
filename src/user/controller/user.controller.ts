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
} from '@nestjs/common';
import { CustomExceptionFilter } from '../../exception/custom-exception';
import { IsObjectIdParam } from '../../custom-decorators/validation-mongoose.object-id.decorator';
import { MongoId } from '../../mongoose.interface';
import { JwtAuthGuard } from '../../auth/guards/jwt-guards';
import { Request } from 'express';
import { GetUser } from 'src/custom-decorators/get-user.decorator';
import { IJwtData } from 'src/auth/strategies/jwt-strategy';

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

  @UseGuards(JwtAuthGuard)
  @Get('me/subscribe')
  async getSubscribeBlogs(@GetUser() user: IJwtData) {
    return await this.userService.getSubscribeBlogs(user._id);
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

  @Get(':id')
  findOne(@IsObjectIdParam() id: MongoId) {
    return this.userService.findById(id);
  }
}
