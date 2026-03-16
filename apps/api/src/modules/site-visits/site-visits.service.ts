import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteVisitDto } from './dto/create-site-visit.dto';
import { UpdateSiteVisitDto } from './dto/update-site-visit.dto';
import { VisitOutcome, Prisma } from '@prisma/client';

@Injectable()
export class SiteVisitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { leadId?: string; outcome?: VisitOutcome }, page = 1, limit = 25) {
    const skip = (page - 1) * limit;
    return this.prisma.siteVisit.findMany({
      where: {
        lead: { isActive: true },
        leadId: filters.leadId ? filters.leadId : undefined,
        outcome: filters.outcome ? filters.outcome : undefined,
      },
      skip,
      take: limit,
      include: { lead: { select: { id: true, name: true } }, agent: { select: { id: true, name: true } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateSiteVisitDto) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: dto.leadId, isActive: true },
    });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const visit = await tx.siteVisit.create({
        data: {
          leadId: dto.leadId,
          agentId: userId,
          scheduledAt: dto.scheduledAt,
          notes: dto.notes,
        },
      });
      await tx.activity.create({
        data: {
          leadId: dto.leadId,
          userId,
          type: 'SITE_VISIT',
          description: `Site visit scheduled for ${dto.scheduledAt.toLocaleString()}`,
        },
      });
      return visit;
    });
  }

  async update(id: string, userId: string, dto: UpdateSiteVisitDto) {
    const visit = await this.prisma.siteVisit.findFirst({
      where: { id },
    });
    if (!visit) throw new NotFoundException('Site Visit not found');

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.siteVisit.update({
        where: { id },
        data: {
          outcome: dto.outcome,
          notes: dto.notes ? dto.notes : undefined,
        },
      });
      await tx.activity.create({
        data: {
          leadId: visit.leadId,
          userId,
          type: 'NOTE', 
          description: `Site visit outcome updated to ${dto.outcome}. Notes: ${dto.notes || 'N/A'}`,
        },
      });
      return updated;
    });
  }
}
