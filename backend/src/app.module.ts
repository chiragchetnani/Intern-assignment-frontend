import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TestController } from './test/test.controller';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ChatModule, AiModule, RepositoryModule],
  controllers: [AppController, TestController, AdminController],
  providers: [AppService, AdminService],
})
export class AppModule {}
