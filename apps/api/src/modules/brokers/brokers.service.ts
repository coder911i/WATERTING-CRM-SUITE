import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import * as crypto from 'crypto';

@Injectable()
export class BrokersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBrokerDto) {
    const existing = await this.prisma.broker.findFirst({
      where: { phone: dto.phone },
    });
    if (existing) throw new ConflictException('Broker with this phone already exists');

    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    return this.prisma.broker.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email || null,
        reraNumber: dto.reraNumber || null,
        firmName: dto.firmName || null,
        commissionPct: dto.commissionPct || 2.0,
        referralCode,
        isApproved: false, // requires admin approval
      } as any,
    });
  }

  async registerPublic(dto: CreateBrokerDto) {
    return this.create(dto);
  }

  async findAll() {
    return this.prisma.broker.findMany({
      include: {
        _count: {
          select: { leads: true, commissions: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const broker = await this.prisma.broker.findFirst({
      where: { id },
      include: {
        leads: { select: { id: true, name: true, stage: true, createdAt: true } },
        commissions: true,
      },
    });
    if (!broker) throw new NotFoundException('Broker not found');
    return broker;
  }

  async approve(id: string) {
    const broker = await this.prisma.broker.findFirst({ where: { id } });
    if (!broker) throw new NotFoundException('Broker not found');

    return this.prisma.broker.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async deactivate(id: string) {
    const broker = await this.prisma.broker.findFirst({ where: { id } });
    if (!broker) throw new NotFoundException('Broker not found');

    return this.prisma.broker.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
