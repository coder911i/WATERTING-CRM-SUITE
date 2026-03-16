import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [LeadsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
