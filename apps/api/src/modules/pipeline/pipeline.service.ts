import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PipelineStage } from '@prisma/client';

@Injectable()
export class PipelineService {
  constructor(private prisma: PrismaService) {}

  async getKanban(tenantId: string) {
    const leads = await this.prisma.lead.findMany({
      where: { tenantId, isActive: true },
      include: { assignedTo: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } },
    });

    const stages = Object.values(PipelineStage);
    const kanban = stages.reduce<Record<PipelineStage, { leads: any[]; count: number; totalBudget: number }>>((acc, stage) => {
      const stageLeads = leads.filter(l => l.stage === stage);
      acc[stage] = {
        leads: stageLeads,
        count: stageLeads.length,
        totalBudget: stageLeads.reduce((sum: number, l) => sum + (l.budgetMax || 0), 0),
      };
      return acc;
    }, {} as any);

    return kanban;

  }

  async moveLead(id: string, tenantId: string, stage: PipelineStage, userId?: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId, isActive: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.lead.update({
        where: { id },
        data: { stage },
      });
      await tx.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'STAGE_CHANGE',
          description: `Stage moved from ${lead.stage} to ${stage}`,
        },
      });
      return updated;
    });
  }
}
