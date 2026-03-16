import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PipelineStage, Prisma } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { PropertyRecommendationAgent } from '../ai/agents/property-recommendation.agent';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private recommendAgent: PropertyRecommendationAgent,
  ) {}

  async findAll(filters: { stage?: PipelineStage; source?: any; agentId?: string; search?: string }, page = 1, limit = 25) {
    const skip = (page - 1) * limit;
    const items = await this.prisma.lead.findMany({
      where: {
        isActive: true,
        stage: filters.stage ? filters.stage : undefined,
        source: filters.source ? filters.source : undefined,
        assignedToId: filters.agentId ? filters.agentId : undefined,
        OR: filters.search ? [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { phone: { contains: filters.search } }
        ] : undefined,
      },
      skip,
      take: limit,
      include: { assignedTo: true, project: true },
    });
    const total = await this.prisma.lead.count({ where: { isActive: true }});
    return { items, total, page, limit };
  }

  async create(dto: CreateLeadDto) {
    const existing = await this.prisma.lead.findFirst({
      where: { phone: dto.phone, isActive: true },
    });
    if (existing) throw new ConflictException('Lead with this phone number already exists');

    const lead = await this.prisma.lead.create({
      data: dto,
    });

    await this.aiService.triggerScoring(lead.id);

    return lead;
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, isActive: true },
      include: { activities: { orderBy: { createdAt: 'desc' } }, siteVisits: true, assignedTo: true, project: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    const lead = await this.prisma.lead.findFirst({ where: { id, isActive: true } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.lead.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, isActive: true } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.lead.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async changeStage(id: string, stage: PipelineStage, userId?: string) {
    const existingLead = await this.prisma.lead.findFirst({ where: { id, isActive: true } });
    if (!existingLead) throw new NotFoundException('Lead not found');

    const lead = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedLead = await tx.lead.update({
        where: { id },
        data: { stage },
      });
      await tx.activity.create({
        data: {
          leadId: id,
          userId,
          type: 'NOTE',
          description: `Stage changed to ${stage}`,
        },
      });
      return updatedLead;
    });

    return lead;
  }

  async getRecommendations(id: string) {
    const lead = await this.findOne(id);
    return this.recommendAgent.recommend(lead);
  }
}
