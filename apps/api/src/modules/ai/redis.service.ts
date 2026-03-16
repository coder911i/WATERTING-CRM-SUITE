import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AiRedisService implements OnModuleInit {
  private readonly logger = new Logger(AiRedisService.name);
  private client!: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('REDIS_URL');
    const host = this.configService.get<string>('REDIS_HOST');
    const port = parseInt(this.configService.get<string>('REDIS_PORT') || '6379');
    const password = this.configService.get<string>('REDIS_PASSWORD');

    if (!url && !host) {
      this.logger.warn('Redis not configured, skipping initialization');
      return;
    }

    try {
      if (url) {
        this.client = new Redis(url, {
          tls: url.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
        });
        this.logger.log(`Redis initialized for AI memory using REDIS_URL`);
      } else {
        this.client = new Redis({ host, port, password });
        this.logger.log(`Redis initialized for AI memory at ${host}:${port}`);
      }
    } catch (e: any) {
      this.logger.warn(`Redis connection failed: ${e.message}`);
    }
  }

  async getChatHistory(leadId: string): Promise<any[]> {
    const key = `whatsapp:memory:${leadId}`;
    if (!this.client) return [];
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
    if (!this.client) return;
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
