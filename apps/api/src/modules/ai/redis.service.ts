import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AiRedisService implements OnModuleInit {
  private readonly logger = new Logger(AiRedisService.name);
  private client!: Redis;

  onModuleInit() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379');
    this.client = new Redis({ host, port });
    this.logger.log(`Redis initialized for AI memory at ${host}:${port}`);
  }

  async getChatHistory(leadId: string): Promise<any[]> {
    const key = `whatsapp:memory:${leadId}`;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : [];
    } catch (e: any) {
      this.logger.error(`Failed to get history for ${leadId}: ${e.message}`);
      return [];
    }
  }

  async saveMessage(leadId: string, role: 'user' | 'assistant', content: string) {
    const key = `whatsapp:memory:${leadId}`;
    try {
      const history = await this.getChatHistory(leadId);
      history.push({ role, content });

      // Keep last 10 layout triggers thresholds triggers
      const trimmed = history.slice(-10);
      await this.client.set(key, JSON.stringify(trimmed), 'EX', 86400 * 7); // 7 days expiration thresholds triggers layout
    } catch (e: any) {
      this.logger.error(`Failed to save message for ${leadId}: ${e.message}`);
    }
  }
}
