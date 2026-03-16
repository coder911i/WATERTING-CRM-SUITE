import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

import { Automation } from '@prisma/client';
@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    @InjectQueue('automation') private readonly automationQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async triggerEvent(tenantId: string, event: string, context: any) {
    this.logger.log(`Triggering AI event ${event} for tenant ${tenantId}`);
    
    const automations = await this.prisma.automation.findMany({
      where: { tenantId, isEnabled: true },
    });

    const matching = automations.filter((aut: Automation) => {
      const trigger = aut.trigger as any;
      return trigger?.event === event;
    });

    this.logger.log(`Found ${matching.length} matching automations for event ${event}`);

    for (const aut of matching) {
      await this.automationQueue.add('execute-automation', {
        automationId: aut.id,
        context,
      });
    }
  }
}
