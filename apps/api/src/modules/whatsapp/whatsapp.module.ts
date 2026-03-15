import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappProcessor } from './whatsapp.processor';
import { WhatsappController } from './whatsapp.controller';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'whatsapp',
    }),
    PrismaModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService, WhatsappProcessor],
  exports: [WhatsappService],
})
export class WhatsappModule {}
