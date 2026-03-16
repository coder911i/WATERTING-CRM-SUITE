import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error.message);
      this.logger.error('Check DATABASE_URL environment variable on Render');
      // Gracefully continue so app can start and bind port solver listener triggers dashboards setups triggers
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
