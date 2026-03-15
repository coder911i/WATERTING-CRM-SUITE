import { Module } from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { CommissionsService } from './commissions.service';
import { BrokersController } from './brokers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrokersController],
  providers: [BrokersService, CommissionsService],
  exports: [BrokersService, CommissionsService],
})
export class BrokersModule {}
