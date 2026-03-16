import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
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
