import { Test, TestingModule } from '@nestjs/testing';
import { PipelineService } from './pipeline.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaClient } from '../../../test/prisma.mock';
import { PipelineStage } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('PipelineService', () => {
  let service: PipelineService;
  let prisma: any;

  beforeEach(async () => {
    prisma = createMockPrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelineService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PipelineService>(PipelineService);
  });

  describe('getKanban', () => {
    it('should filter by tenantId and group by stage', async () => {
      const mockLeads = [
        { id: '1', stage: PipelineStage.NEW, budgetMax: 1000, tenantId: 'tenant1', isActive: true },
        { id: '2', stage: PipelineStage.CONTACTED, budgetMax: 2000, tenantId: 'tenant1', isActive: true },
      ];
      prisma.lead.findMany.mockResolvedValue(mockLeads);

      const result = await service.getKanban('tenant1');

      expect(result[PipelineStage.NEW].count).toBe(1);
      expect(result[PipelineStage.NEW].totalBudget).toBe(1000);
      expect(result[PipelineStage.CONTACTED].count).toBe(1);
    });
  });

  describe('moveLead', () => {
    it('should update stage and log activity', async () => {
      prisma.lead.findFirst.mockResolvedValue({ id: '1', tenantId: 'tenant1', stage: PipelineStage.NEW, isActive: true });
      prisma.$transaction.mockResolvedValue({ id: '1', stage: PipelineStage.CONTACTED });

      const result = await service.moveLead('1', 'tenant1', PipelineStage.CONTACTED);

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if lead not found', async () => {
      prisma.lead.findFirst.mockResolvedValue(null);

      await expect(service.moveLead('1', 'tenant1', PipelineStage.CONTACTED)).rejects.toThrow(NotFoundException);
    });
  });
});
