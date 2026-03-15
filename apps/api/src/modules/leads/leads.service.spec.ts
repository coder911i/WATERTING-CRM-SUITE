import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaClient } from '../../../test/prisma.mock';
import { AiService } from '../ai/ai.service';
import { PropertyRecommendationAgent } from '../ai/agents/property-recommendation.agent';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PipelineStage, LeadSource, Priority } from '@prisma/client';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: any;
  let aiService: AiService;

  beforeEach(async () => {
    prisma = createMockPrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AiService, useValue: { triggerScoring: jest.fn() } },
        { provide: PropertyRecommendationAgent, useValue: { recommendProperties: jest.fn().mockResolvedValue({}) } },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    aiService = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create lead and trigger scoring', async () => {
      const dto = { name: 'Lead 1', phone: '1234567890', source: LeadSource.MANUAL };
      prisma.lead.findFirst.mockResolvedValue(null);
      prisma.lead.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create('tenant1', dto);

      expect(result.id).toBe('1');
      expect(aiService.triggerScoring).toHaveBeenCalledWith('1');
    });

    it('should throw ConflictException if lead exists with phone', async () => {
      prisma.lead.findFirst.mockResolvedValue({ id: '1' });
      const dto = { name: 'Lead 1', phone: '1234567890', source: LeadSource.MANUAL };

      await expect(service.create('tenant1', dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('changeStage', () => {
    it('should update stage and trigger scoring', async () => {
      prisma.lead.findFirst.mockResolvedValue({ id: '1', stage: PipelineStage.NEW_LEAD });
      prisma.lead.update = jest.fn().mockResolvedValue({ id: '1', stage: PipelineStage.CONTACTED });

      const result = await service.changeStage('1', 'tenant1', PipelineStage.CONTACTED);

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
