import { Module } from '@nestjs/common';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { PortalsController } from './portals.controller';
import { PortalsProcessor } from './portals.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'portals',
    }),
    PrismaModule,
    WhatsappModule,
  ],
  controllers: [PortalsController],
  providers: [PortalsProcessor],
})
export class PortalsModule {}
