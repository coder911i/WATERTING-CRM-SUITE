import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { SiteVisitsModule } from './modules/site-visits/site-visits.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    ProjectsModule,
    InventoryModule,
    LeadsModule,
    ActivitiesModule,
    PipelineModule,
    SiteVisitsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}









