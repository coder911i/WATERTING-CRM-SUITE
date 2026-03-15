import { Module, Global } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationProcessor } from './automation.processor';
import { AutomationController } from './automation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'automation',
    }),
    PrismaModule,
    WhatsappModule,
  ],
  controllers: [AutomationController],
  providers: [AutomationService, AutomationProcessor],
  exports: [AutomationService],
})
export class AutomationModule {}
