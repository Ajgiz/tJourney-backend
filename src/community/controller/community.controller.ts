import { SearchCommunityDto } from './../dto/search-community.dto';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { CustomValidationPipe } from './../../validation-pipe/custom-validation-pipe';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CustomExceptionFilter } from 'src/exception/custom-exception';
import { CommunityService } from '../service/community.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { GetUser } from 'src/custom-decorators/get-user.decorator';
import { IJwtData } from 'src/auth/strategies/jwt-strategy';
import { SubscribeCommunityDto } from '../dto/subscribe-community.dto';

@UseFilters(CustomExceptionFilter)
@UsePipes(CustomValidationPipe)
@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@GetUser() user: IJwtData, @Body() dto: CreateCommunityDto) {
    return await this.communityService.create(dto, user._id);
  }

  @Get('search')
  async search(@Query() dto: SearchCommunityDto) {
    return await this.communityService.search(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyCommunity(@GetUser() user: IJwtData) {
    return await this.communityService.getMyCommunity(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/subscribe')
  async getSubscribeCommunity(@GetUser() user: IJwtData) {
    return await this.communityService.getSubscribeCommunity(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('subscribe')
  async subscribe(
    @GetUser() user: IJwtData,
    @Body() dto: SubscribeCommunityDto,
  ) {
    return await this.communityService.subscribe(dto.id, user._id);
  }
}
