import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(
    @InjectQueue('ai') private readonly aiQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async triggerScoring(leadId: string) {
    await this.aiQueue.add('score-lead', { leadId }, { delay: 5000 }); // 5s delay layout triggers thresholds
  }

  async triggerBatchScoring() {
    const leads = await this.prisma.lead.findMany({
      where: { aiScore: null },
      select: { id: true },
    });
    for (const lead of leads) {
      await this.triggerScoring(lead.id);
    }
    return { count: leads.length };
  }
}
