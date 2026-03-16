import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaClient } from '../../../test/prisma.mock';
import { AiService } from '../ai/ai.service';
import { PropertyRecommendationAgent } from '../ai/agents/property-recommendation.agent';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PipelineStage, LeadSource } from '@prisma/client';

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
        { provide: AiService, useValue: { triggerScoring: jest.fn().mockResolvedValue({}) } },
        { provide: PropertyRecommendationAgent, useValue: { recommendProperties: jest.fn().mockResolvedValue({}) } },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    aiService = module.get<AiService>(AiService);
  });

  describe('createLead', () => {
    it('should create with tenantId and log activity', async () => {
      const dto = { name: 'Lead 1', phone: '1234567890', source: LeadSource.OTHER };
      prisma.lead.findFirst.mockResolvedValue(null);
      prisma.lead.create.mockResolvedValue({ id: '1', ...dto, tenantId: 'tenant1', stage: PipelineStage.NEW });

      const result = await service.create('tenant1', dto);

      expect(result.id).toBe('1');
    });

    it('should throw ConflictException if lead exists with phone', async () => {
      prisma.lead.findFirst.mockResolvedValue({ id: '1' });
      const dto = { name: 'Lead 1', phone: '1234567890', source: LeadSource.OTHER };

      await expect(service.create('tenant1', dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateLead', () => {
    it('should update fields successfully', async () => {
      prisma.lead.findFirst.mockResolvedValue({ id: '1', tenantId: 'tenant1', isActive: true });
      prisma.lead.update.mockResolvedValue({ id: '1', name: 'Updated' });

      const result = await service.update('1', 'tenant1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.lead.findFirst.mockResolvedValue(null);
      await expect(service.update('1', 'tenant1', { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePipelineStage', () => {
    it('should update stage and log activity', async () => {
      prisma.lead.findFirst.mockResolvedValue({ id: '1', stage: PipelineStage.NEW });
      prisma.$transaction.mockResolvedValue({ id: '1', stage: PipelineStage.CONTACTED });

      const result = await service.changeStage('1', 'tenant1', PipelineStage.CONTACTED);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('deleteLead', () => {
    it('should soft delete lead', async () => {
      prisma.lead.findFirst.mockResolvedValue({ id: '1', tenantId: 'tenant1', isActive: true });
      prisma.lead.update.mockResolvedValue({ id: '1', isActive: false });

      const result = await service.softDelete('1', 'tenant1');
      expect(prisma.lead.update).toHaveBeenCalledWith(expect.objectContaining({
        data: { isActive: false }
      }));
    });
  });
});
