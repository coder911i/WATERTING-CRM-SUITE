import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PipelineStage, Prisma, Lead } from '@prisma/client';

@Injectable()
export class PipelineService {
  constructor(private prisma: PrismaService) {}

  async getKanban() {
    const leads = await this.prisma.lead.findMany({
      where: { isActive: true },
      include: { assignedTo: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } },
    });

    const stages = Object.values(PipelineStage);
    const kanban = stages.reduce<Record<string, { leads: Lead[]; count: number; totalBudget: number }>>((acc: Record<string, { leads: Lead[]; count: number; totalBudget: number }>, stage: PipelineStage) => {
      const stageLeads = leads.filter((l: Lead) => l.stage === stage) as Lead[];
      acc[stage] = {
        leads: stageLeads,
        count: stageLeads.length,
        totalBudget: stageLeads.reduce((sum: number, l: Lead) => sum + (l.budgetMax || 0), 0),
      };
      return acc;
    }, {} as Record<string, { leads: Lead[]; count: number; totalBudget: number }>);

    return kanban;
  }

  async moveLead(id: string, stage: PipelineStage, userId?: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, isActive: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.lead.update({
        where: { id },
        data: { stage },
      });
      await tx.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'NOTE',
          description: `Stage moved from ${lead.stage} to ${stage}`,
        } as any,
      });
      return updated;
    });
  }
}
