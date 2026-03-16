import { Test, TestingModule } from '@nestjs/testing';
import { SiteVisitsService } from './site-visits.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaClient } from '../../../test/prisma.mock';
import { NotFoundException } from '@nestjs/common';
import { VisitOutcome } from '@prisma/client';

describe('SiteVisitsService', () => {
  let service: SiteVisitsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = createMockPrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiteVisitsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SiteVisitsService>(SiteVisitsService);
  });

  describe('findAll', () => {
    it('should filter by tenantId and return visits', async () => {
      prisma.siteVisit.findMany.mockResolvedValue([{ id: '1', notes: 'Visit 1' }]);

      const result = await service.findAll('tenant1', {});

      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create visit and log activity', async () => {
      const dto = { leadId: 'lead1', scheduledAt: new Date(), notes: 'Test Note' };
      prisma.lead.findFirst.mockResolvedValue({ id: 'lead1', tenantId: 'tenant1', isActive: true });
      prisma.$transaction.mockResolvedValue({ id: 'visit1' });

      const result = await service.create('tenant1', 'user1', dto);

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if lead not found', async () => {
      const dto = { leadId: 'lead1', scheduledAt: new Date(), notes: 'Test Note' };
      prisma.lead.findFirst.mockResolvedValue(null);

      await expect(service.create('tenant1', 'user1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update outcome and log activity', async () => {
      prisma.siteVisit.findFirst.mockResolvedValue({ id: '1', leadId: 'lead1' });
      prisma.$transaction.mockResolvedValue({ id: '1', outcome: VisitOutcome.INTERESTED });

      const result = await service.update('1', 'tenant1', 'user1', { outcome: VisitOutcome.INTERESTED });

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if visit not found', async () => {
      prisma.siteVisit.findFirst.mockResolvedValue(null);

      await expect(service.update('1', 'tenant1', 'user1', { outcome: VisitOutcome.INTERESTED })).rejects.toThrow(NotFoundException);
    });
  });
});
