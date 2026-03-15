import { Module } from '@nestjs/common';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

import { BullModule } from '@nestjs/bull';
import { FacebookController } from './facebook.controller';
import { FacebookProcessor } from './facebook.processor';
import { PrismaModule as CorePrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'facebook',
    }),
    CorePrismaModule,
    WhatsappModule,
  ],
  controllers: [FacebookController],
  providers: [FacebookProcessor],
})
export class FacebookModule {}
