import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findByLead(leadId: string, tenantId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, isActive: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async create(leadId: string, tenantId: string, userId: string, dto: CreateActivityDto) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, isActive: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.activity.create({
      data: {
        tenantId,
        leadId,
        userId,
        type: dto.type,
        description: dto.description,
        metadata: dto.metadata || {},
      },
    });
  }
}
