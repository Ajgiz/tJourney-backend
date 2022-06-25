import { SearchPostDto } from './../dto/search-post.dto';
import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
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
  HttpCode,
  Query,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CustomValidationPipe } from 'src/validation-pipe/custom-validation-pipe';
import { CustomExceptionFilter } from 'src/exception/custom-exception';
import { IsObjectIdParam } from 'src/custom-decorators/validation-mongoose.object-id';

@UseFilters(CustomExceptionFilter)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UsePipes(CustomValidationPipe)
  @Post('create')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @HttpCode(200)
  findAllNew() {
    return this.postService.findAllNew();
  }

  @Get('search')
  @HttpCode(200)
  search(@Query() dto: SearchPostDto) {
    return this.postService.search(dto);
  }

  @Get('/popular')
  @HttpCode(200)
  findPopularPosts() {
    return this.postService.findPopularPosts();
  }

  @Delete('clean')
  clean() {
    return this.postService.clean();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@IsObjectIdParam() id: ObjectId) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(
    @IsObjectIdParam() id: ObjectId,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(200)
  deleteOne(@IsObjectIdParam() id: ObjectId) {
    return this.postService.deleteOne(id);
  }
}
