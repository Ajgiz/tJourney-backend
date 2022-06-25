import { CustomValidationPipe } from './../../validation-pipe/custom-validation-pipe';
import { CommentService } from '../service/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseFilters,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { CustomExceptionFilter } from 'src/exception/custom-exception';
import { IsObjectIdParam } from 'src/custom-decorators/validation-mongoose.object-id';
import { ObjectId } from 'mongoose';

@UseFilters(CustomExceptionFilter)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UsePipes(CustomValidationPipe)
  @Post('create')
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Get('find-all')
  @HttpCode(200)
  findAll() {
    return this.commentService.findAll();
  }

  @Get('get/:id')
  @HttpCode(200)
  findOne(@IsObjectIdParam() id: ObjectId) {
    return this.commentService.findOne(id);
  }

  @UsePipes(CustomValidationPipe)
  @Patch('update/:id')
  @HttpCode(200)
  update(@IsObjectIdParam() id: ObjectId, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, dto);
  }

  @Delete('delete/:id')
  @HttpCode(200)
  deleteOne(@IsObjectIdParam() id: ObjectId) {
    return this.commentService.deleteOne(id);
  }
}
