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
  UseGuards,
} from '@nestjs/common';
import { CustomValidationPipe } from '../../validation-pipe/custom-validation-pipe';
import { CustomExceptionFilter } from '../../exception/custom-exception';
import { IsObjectIdParam } from '../../custom-decorators/validation-mongoose.object-id.decorator';
import { MongoId } from '../../mongoose.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { GetUser } from 'src/custom-decorators/get-user.decorator';
import { IJwtData } from 'src/auth/strategies/jwt-strategy';

@UseFilters(CustomExceptionFilter)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(CustomValidationPipe)
  @Post('create')
  create(@GetUser() user: IJwtData, @Body() createPostDto: CreatePostDto) {
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

  @Get('popular')
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
  findOne(@IsObjectIdParam() id: MongoId) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  update(@IsObjectIdParam() id: MongoId, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  deleteOne(@IsObjectIdParam() id: MongoId) {
    return this.postService.deleteOne(id);
  }
}
