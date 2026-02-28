import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {

  private FASTAPI_URL = 'http://127.0.0.1:8000/query';

  async generateLegalResponse(query: string, chatId?: string) {
    try {
      const response = await axios.post(
        this.FASTAPI_URL,
        {
          chat_id: chatId || null,
          query: query,
        },
        {
          timeout: 160000, // prevent infinite hang
        },
      );

      const data = response.data;

      return {
        structuredResponse: data.structuredResponse,
        agentLogs: data.agentLogs || [],
        totalExecutionTimeMs: data.totalExecutionTimeMs,
      };

    } catch (error: any) {
      console.error(
        'FastAPI Error:',
        error?.response?.data || error.message,
      );

      throw new HttpException('AI Engine Failed', 500);
    }
  }
}