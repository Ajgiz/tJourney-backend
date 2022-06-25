import { ObjectId } from 'mongoose';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
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
} from '@nestjs/common';
import { CustomValidationPipe } from 'src/validation-pipe/custom-validation-pipe';
import { CustomExceptionFilter } from 'src/exception/custom-exception';
import { IsObjectIdParam } from 'src/custom-decorators/validation-mongoose.object-id';

@UseFilters(CustomExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(CustomValidationPipe)
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@IsObjectIdParam() id: ObjectId) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(
    @IsObjectIdParam() id: ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@IsObjectIdParam() id: ObjectId) {
    return this.userService.deleteOne(id);
  }
}
