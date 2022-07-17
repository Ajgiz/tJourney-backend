import { UpdateLikesDto } from './../../post/dto/update-post.dto';
import { GetCommentsDto } from './../dto/get-comments.dto';
import { IJwtData } from './../../auth/strategies/jwt-strategy';
import { JwtAuthGuard } from './../../auth/guards/jwt-guards';
import { ObjectId } from 'mongodb';
import { CustomValidationPipe } from './../../validation-pipe/custom-validation-pipe';
import { CommentService } from '../service/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  UseFilters,
  UsePipes,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CustomExceptionFilter } from '../../exception/custom-exception';
import { IsObjectIdParam } from '../../custom-decorators/validation-mongoose.object-id.decorator';
import { GetUser } from 'src/custom-decorators/get-user.decorator';

@UseFilters(CustomExceptionFilter)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UsePipes(CustomValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateCommentDto, @GetUser() user: IJwtData) {
    return this.commentService.create(dto, user._id);
  }

  @Get('find')
  @HttpCode(200)
  findAll(@Query() searchDto: GetCommentsDto) {
    return this.commentService.findAll(searchDto);
  }

  @Get('get/:id')
  @HttpCode(200)
  findOne(@IsObjectIdParam() id: ObjectId) {
    return this.commentService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('like')
  @HttpCode(200)
  setLike(@GetUser() user: IJwtData, @Body() dto: UpdateLikesDto) {
    return this.commentService.setLike(user._id, dto.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('dislike')
  @HttpCode(200)
  setDislike(@GetUser() user: IJwtData, @Body() dto: UpdateLikesDto) {
    return this.commentService.setDislike(user._id, dto.id);
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
