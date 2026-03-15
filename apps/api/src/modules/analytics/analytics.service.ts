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

  async getBrokerPerformance(tenantId: string) {
    const brokers = await this.prisma.broker.findMany({
      where: { tenantId },
      include: {
        _count: { select: { leads: true } },
        commissions: { select: { amount: true, status: true } },
      },
    });

    return brokers.map(b => {
      const totalCommission = b.commissions.reduce((sum, c) => sum + c.amount, 0);
      const paidCommission = b.commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);
      return {
        id: b.id,
        name: b.name,
        leadsCount: b._count.leads,
        totalCommission,
        paidCommission,
      };
    });
  }

  async getProjectSales(tenantId: string) {
    const projects = await this.prisma.project.findMany({
      where: { tenantId },
      include: {
        towers: {
          include: {
            units: {
              include: { booking: { select: { totalAmount: true } } }
            }
          }
        }
      }
    });

    return projects.map(p => {
      let totalSales = 0;
      let bookingsCount = 0;
      p.towers.forEach(t => {
        t.units.forEach(u => {
          if (u.booking) {
            totalSales += u.booking.totalAmount;
            bookingsCount++;
          }
        });
      });
      return {
        id: p.id,
        name: p.name,
        totalSales,
        bookingsCount,
      };
    });
  }

  async getPaymentForecast(tenantId: string) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const pendingPayments = await this.prisma.payment.findMany({
      where: {
        booking: { tenantId },
        status: 'PENDING',
        dueDate: { lte: thirtyDaysFromNow },
      },
      select: { amount: true },
    });

    return {
      forecastAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
      count: pendingPayments.length,
    };
  }
}
