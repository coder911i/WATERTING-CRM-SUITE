import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PipelineStage, UnitStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(tenantId: string) {
    const [leadsCount, newLeadsCount, visitsCount, units] = await Promise.all([
      this.prisma.lead.count({ where: { tenantId, isActive: true } }),
      this.prisma.lead.count({ where: { tenantId, isActive: true, stage: PipelineStage.NEW_LEAD } }),
      this.prisma.siteVisit.count({ where: { lead: { tenantId } } }),
      this.prisma.unit.findMany({
        where: { tower: { project: { tenantId } } },
        select: { status: true },
      }),
    ]);

    const inventory = {
      available: units.filter(u => u.status === UnitStatus.AVAILABLE).length,
      reserved: units.filter(u => u.status === UnitStatus.RESERVED).length,
      sold: units.filter(u => u.status === UnitStatus.SOLD || u.status === UnitStatus.BOOKED).length,
    };

    return {
      totalLeads: leadsCount,
      newLeads: newLeadsCount,
      siteVisits: visitsCount,
      inventory,
    };
  }

  async getLeadsByStatus(tenantId: string) {
    const leads = await this.prisma.lead.findMany({
      where: { tenantId, isActive: true },
      select: { stage: true },
    });

    const stages = Object.values(PipelineStage);
    const distribution = stages.reduce<Record<PipelineStage, number>>((acc, stage) => {
      acc[stage] = leads.filter(l => l.stage === stage).length;
      return acc;
    }, {} as any);

    return distribution;

  }
}
