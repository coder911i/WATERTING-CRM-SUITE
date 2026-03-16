import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'waterting-api',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      database: process.env.DATABASE_URL ? 'configured' : 'missing',
      redis: (process.env.REDIS_URL || process.env.REDIS_HOST) ? 'configured' : 'not configured',
      ai: process.env.NVIDIA_API_KEY ? 'configured' : 'not configured',
      vector: process.env.PINECONE_API_KEY ? 'configured' : 'not configured',
    };
  }

  @Get()
  root() {
    return { message: 'Waterting CRM API', health: '/api/health' };
  }
}
