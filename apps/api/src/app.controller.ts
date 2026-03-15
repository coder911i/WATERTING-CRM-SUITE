import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { 
      status: 'ok', 
      timestamp: new Date(),
      environment: process.env.NODE_ENV 
    };
  }

  @Get('api/health')
  apiHealth() {
    return this.health();
  }
}
