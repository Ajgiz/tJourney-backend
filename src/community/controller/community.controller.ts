import { ObjectId } from 'mongodb';
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
import { IsObjectIdParam } from 'src/custom-decorators/validation-mongoose.object-id.decorator';
import { GetRatingsDto } from 'src/user/dto/get-rating-users';

@UseFilters(CustomExceptionFilter)
@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UsePipes(CustomValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@GetUser() user: IJwtData, @Body() dto: CreateCommunityDto) {
    return await this.communityService.create(dto, user._id);
  }

  @UsePipes(CustomValidationPipe)
  @Get('search')
  async search(@Query() dto: SearchCommunityDto) {
    return await this.communityService.search(dto);
  }

  @Get('ratings')
  async getRating(@Query() dto: GetRatingsDto) {
    return await this.communityService.getRatings(dto.period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyCommunity(@GetUser() user: IJwtData) {
    return await this.communityService.getMyCommunity(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/subscriptions/:id')
  async getMeSubscriptionsCommunity(@GetUser() user: IJwtData) {
    return await this.communityService.getSubscriptionsOnCommunity(user._id);
  }

  @Get('subscriptions/:id')
  async getSubscriptionsCommunity(@IsObjectIdParam() id: ObjectId) {
    return await this.communityService.getSubscriptionsOnCommunity(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('subsciption/:id')
  async subsciption(
    @IsObjectIdParam() id: ObjectId,
    @GetUser() user: IJwtData,
  ) {
    return await this.communityService.subsciption(id, user._id);
  }
}
