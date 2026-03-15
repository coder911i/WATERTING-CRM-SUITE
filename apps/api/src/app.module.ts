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
import { BullModule } from '@nestjs/bull';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { PortalsModule } from './modules/portals/portals.module';
import { FacebookModule } from './modules/facebook/facebook.module';
import { BrokersModule } from './modules/brokers/brokers.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AutomationModule } from './modules/automation/automation.module';
import { PortalModule } from './modules/portal/portal.module';
import { AiModule } from './modules/ai/ai.module';

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
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT as string) || 6379,
      },
    }),
    WhatsappModule,
    PortalsModule,
    FacebookModule,
    BrokersModule,
    BookingsModule,
    PaymentsModule,
    AutomationModule,
    PortalModule,
    AiModule,
  ],
})
export class AppModule {}









