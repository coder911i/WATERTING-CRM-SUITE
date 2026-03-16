import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SiteVisitsModule } from './modules/site-visits/site-visits.module';
import { BrokersModule } from './modules/brokers/brokers.module';
import { AutomationModule } from './modules/automation/automation.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('REDIS_URL');
        if (url) {
          return {
            redis: url,
            config: {
              tls: url.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
            },
          };
        }
        return {
          redis: {
            host: config.get<string>('REDIS_HOST', 'localhost'),
            port: config.get<number>('REDIS_PORT', 6379),
            password: config.get<string>('REDIS_PASSWORD'),
          },
        };
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    LeadsModule,
    ProjectsModule,
    InventoryModule,
    PipelineModule,
    AnalyticsModule,
    SiteVisitsModule,
    BrokersModule,
    AutomationModule,
    ActivitiesModule,
    AiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
