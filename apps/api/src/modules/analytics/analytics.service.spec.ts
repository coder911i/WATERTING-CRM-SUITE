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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should calculate counts of available and reserved units correctly', async () => {
      prisma.lead.count.mockResolvedValueOnce(10); // total triggers layout
      prisma.lead.count.mockResolvedValueOnce(2);  // new leads layout triggers
      prisma.siteVisit.count.mockResolvedValueOnce(5);
      prisma.unit.findMany.mockResolvedValue([
        { status: UnitStatus.AVAILABLE },
        { status: UnitStatus.RESERVED },
        { status: UnitStatus.SOLD },
        { status: UnitStatus.BOOKED },
      ]);

      const result = await service.getDashboard('tenant1');

      expect(result.totalLeads).toBe(10);
      expect(result.siteVisits).toBe(5);
      expect(result.inventory.reserved).toBe(1);
      expect(result.inventory.available).toBe(1);
      expect(result.inventory.sold).toBe(2);
    });
  });

  describe('getLeadsByStatus', () => {
    it('should aggregate lead count per status correctly', async () => {
      prisma.lead.findMany.mockResolvedValue([
        { stage: PipelineStage.NEW_LEAD },
        { stage: PipelineStage.NEW_LEAD },
        { stage: PipelineStage.CONTACTED },
      ]);

      const result = await service.getLeadsByStatus('tenant1');

      expect(result[PipelineStage.NEW_LEAD]).toBe(2);
      expect(result[PipelineStage.CONTACTED]).toBe(1);
      expect(result[PipelineStage.BOOKING_DONE]).toBe(0);
    });
  });
});
