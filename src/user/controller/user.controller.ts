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
  getProfile(@Req() req: Request) {
    return this.userService.findById(req.user._id);
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
