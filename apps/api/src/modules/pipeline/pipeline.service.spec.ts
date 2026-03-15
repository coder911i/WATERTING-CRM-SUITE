import { Test, TestingModule } from '@nestjs/testing';
import { PipelineService } from './pipeline.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaClient } from '../../../test/prisma.mock';
import { PipelineStage } from '@prisma/client';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getKanban', () => {
    it('should aggregate lead values grouped by status correctly', async () => {
      prisma.lead.findMany.mockResolvedValue([
        { stage: PipelineStage.NEW_LEAD, budgetMax: 1000000 },
        { stage: PipelineStage.NEW_LEAD, budgetMax: 2000000 },
        { stage: PipelineStage.CONTACTED, budgetMax: 1500000 },
      ]);

      const result = await service.getKanban('tenant1');

      expect(result[PipelineStage.NEW_LEAD].count).toBe(2);
      expect(result[PipelineStage.NEW_LEAD].totalBudget).toBe(3000000);
      expect(result[PipelineStage.CONTACTED].count).toBe(1);
      expect(result[PipelineStage.CONTACTED].totalBudget).toBe(1500000);
    });
  });
});
