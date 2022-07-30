import { MessageModelSchema } from './models/message.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatModelSchema } from './models/chat.model';
import { ChatService } from './services/chat.service';
import { MessageService } from './services/message.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [ChatGateway, ChatService, MessageService],
  imports: [
    MongooseModule.forFeature([
      { name: NAME_MODEL_ENUM.CHAT, schema: ChatModelSchema },
      { name: NAME_MODEL_ENUM.MESSAGE, schema: MessageModelSchema },
    ]),
    UserModule,
  ],
  exports: [ChatService, MessageService],
})
export class ChatModule {}
