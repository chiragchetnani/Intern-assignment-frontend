import { Controller, Post, Get, Param, Body, Req, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  async createChatMessage(
    @Req() req,
    @Body() body: { chatId?: string; query: string },
  ) {
    const userId = req.user.userId;

    return this.chatService.handleQuery(userId, body.chatId, body.query);
  }

  @Get("user")
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  getUserChats(@Req() req) {
    return this.chatService.getUserChats(req.user.userId);
  }

  @Get(':id')
  async getChatById(@Param('id') id: string, @Req() req) {
    return this.chatService.getChatById(id, req.user.userId, req.user.role);
  }

  @Patch("bookmark/:id")
  @Roles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  toggleBookmark(@Param("id") id: string) {
    return this.chatService.toggleBookmark(id);
  }
}