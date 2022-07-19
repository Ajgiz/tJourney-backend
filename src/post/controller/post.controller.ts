import { ObjectId } from 'mongodb';
import { SearchPostDto } from './../dto/search-post.dto';
import { PostService } from '../service/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdateLikesDto, UpdatePostDto } from '../dto/update-post.dto';
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
  Header,
} from '@nestjs/common';
import { CustomValidationPipe } from '../../validation-pipe/custom-validation-pipe';
import { CustomExceptionFilter } from '../../exception/custom-exception';
import { IsObjectIdParam } from '../../custom-decorators/validation-mongoose.object-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { GetUser } from 'src/custom-decorators/get-user.decorator';
import { IJwtData } from 'src/auth/strategies/jwt-strategy';
import { CheckIsAuth } from 'src/custom-decorators/check-is-auth.decorator';

@UseFilters(CustomExceptionFilter)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(CustomValidationPipe)
  @Post('create')
  create(@GetUser() user: IJwtData, @Body() dto: CreatePostDto) {
    return this.postService.create(dto, user._id);
  }

  @Get()
  @HttpCode(200)
  findAllNew() {
    return this.postService.getNewPosts();
  }

  @Get('search')
  @HttpCode(200)
  search(@Query() dto: SearchPostDto) {
    return this.postService.search(dto);
  }

  @Get('popular')
  @HttpCode(200)
  findPopularPosts() {
    return this.postService.getPopularPosts();
  }

  @Delete('clean')
  clean() {
    return this.postService.clean();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('like')
  async setLike(@GetUser() user: IJwtData, @Body() dto: UpdateLikesDto) {
    return await this.postService.setLike(user._id, dto.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('dislike')
  async setDislike(@GetUser() user: IJwtData, @Body() dto: UpdateLikesDto) {
    return await this.postService.setDislike(user._id, dto.id);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@IsObjectIdParam() id: ObjectId, @CheckIsAuth() auth: string) {
    return this.postService.findOne(id, auth);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  update(
    @IsObjectIdParam() id: ObjectId,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(200)
  deleteOne(@IsObjectIdParam() id: ObjectId) {
    return this.postService.deleteOne(id);
  }
}
