import { Socket } from 'socket.io';
import { BASE_CONFIG } from './../../../../frontend/config/index';
import { ObjectId } from 'mongodb';
import { IJwtData } from './../../auth/strategies/jwt-strategy';
import { CreateChatDto } from './dto/create-chat.dto';
import { CustomValidationPipe } from './../../validation-pipe/custom-validation-pipe';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from '../services/chat.service';
import { CustomExceptionFilter } from 'src/exception/custom-exception';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { GetUser } from 'src/custom-decorators/get-user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from '../services/message.service';
import { AddOnlineUserDto } from './dto/add-online-user.dto';
import { IOnlineUsers } from './chat.gateway.interface';

@UseFilters(CustomExceptionFilter)
@UsePipes(CustomValidationPipe)
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit
{
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  afterInit(server: any) {
    console.log('sdasdsad');
  }

  handleDisconnect(client: any) {
    console.log(this.onlineUsers);
    this.onlineUsers = this.onlineUsers.filter((u) => u.socketId !== client.id);
  }

  handleConnection(client: Socket) {
    console.log('HERE');
  }

  private onlineUsers: IOnlineUsers[] = [];

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('create-chat')
  async createChat(
    @MessageBody() dto: CreateChatDto,
    @GetUser() user: IJwtData,
  ) {
    return await this.chatService.create(dto.id, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('create-message')
  async createMessage(
    @MessageBody() dto: CreateMessageDto,
    @GetUser() user: IJwtData,
  ) {
    return await this.messageService.create(dto, user._id);
  }
}
