import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaClient } from '../../../test/prisma.mock';
import { PipelineStage, UnitStatus } from '@prisma/client';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = createMockPrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getDashboard', () => {
    it('should return aggregated counts', async () => {
      prisma.lead.count.mockResolvedValue(10);
      prisma.siteVisit.count.mockResolvedValue(5);
      prisma.unit.findMany.mockResolvedValue([
        { status: UnitStatus.AVAILABLE },
        { status: UnitStatus.SOLD },
      ]);

      const result = await service.getDashboard('tenant1');

      expect(result.totalLeads).toBe(10);
      expect(result.siteVisits).toBe(5);
      expect(result.inventory.available).toBe(1);
      expect(result.inventory.sold).toBe(1);
    });
  });

  describe('getLeadsByStatus', () => {
    it('should group leads by stage', async () => {
      prisma.lead.findMany.mockResolvedValue([
        { stage: PipelineStage.NEW },
        { stage: PipelineStage.NEW },
        { stage: PipelineStage.CONTACTED },
      ]);

      const result = await service.getLeadsByStatus('tenant1');

      expect(result[PipelineStage.NEW]).toBe(2);
      expect(result[PipelineStage.CONTACTED]).toBe(1);
    });
  });

  describe('getBrokerPerformance', () => {
    it('should calculate commissions', async () => {
      prisma.broker.findMany.mockResolvedValue([
        { 
          id: '1', 
          name: 'Broker A', 
          _count: { leads: 5 }, 
          commissions: [
            { amount: 1000, status: 'PAID' },
            { amount: 500, status: 'PENDING' },
          ] 
        }
      ]);

      const result = await service.getBrokerPerformance('tenant1');

      expect(result[0].totalCommission).toBe(1500);
      expect(result[0].paidCommission).toBe(1000);
      expect(result[0].leadsCount).toBe(5);
    });
  });

  describe('getProjectSales', () => {
    it('should sum up unit bookings', async () => {
      prisma.project.findMany.mockResolvedValue([
        {
          id: '1',
          name: 'Project 1',
          towers: [{
            units: [{
              booking: { totalAmount: 50000 }
            }]
          }]
        }
      ]);

      const result = await service.getProjectSales('tenant1');

      expect(result[0].totalSales).toBe(50000);
      expect(result[0].bookingsCount).toBe(1);
    });
  });
});
