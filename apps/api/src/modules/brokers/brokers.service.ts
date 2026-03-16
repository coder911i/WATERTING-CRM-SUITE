import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import * as crypto from 'crypto';

@Injectable()
export class BrokersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateBrokerDto) {
    const existing = await this.prisma.broker.findFirst({
      where: { phone: dto.phone, tenantId },
    });
    if (existing) throw new ConflictException('Broker with this phone already exists');

    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    return this.prisma.broker.create({
      data: {
        tenantId,
        name: dto.name,
        phone: dto.phone,
        email: dto.email || null,
        reraNumber: dto.reraNumber || null,
        firmName: dto.firmName || null,
        commissionPct: dto.commissionPct || 2.0,
        referralCode,
        isApproved: false, // requires admin approval
      },
    });
  }

  async registerPublic(tenantId: string, dto: CreateBrokerDto) {
    // Same as create but explicitly self-assigned
    return this.create(tenantId, dto);
  }

  async findAll(tenantId: string) {
    return this.prisma.broker.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { leads: true, commissions: true },
        },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const broker = await this.prisma.broker.findFirst({
      where: { id, tenantId },
      include: {
        leads: { select: { id: true, name: true, stage: true, createdAt: true } },
        commissions: true,
      },
    });
    if (!broker) throw new NotFoundException('Broker not found');
    return broker;
  }

  async approve(id: string, tenantId: string) {
    const broker = await this.prisma.broker.findFirst({ where: { id, tenantId } });
    if (!broker) throw new NotFoundException('Broker not found');

    return this.prisma.broker.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async deactivate(id: string, tenantId: string) {
    const broker = await this.prisma.broker.findFirst({ where: { id, tenantId } });
    if (!broker) throw new NotFoundException('Broker not found');

    return this.prisma.broker.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
