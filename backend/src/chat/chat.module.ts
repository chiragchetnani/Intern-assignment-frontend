import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
