import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ReserveUnitDto } from './dto/reserve-unit.dto';
import { UnitStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { projectId?: string; towerId?: string; status?: UnitStatus; bhk?: string }) {
    return this.prisma.unit.findMany({
      where: {
        tower: {
          project: filters.projectId ? { id: filters.projectId } : undefined,
          id: filters.towerId ? filters.towerId : undefined,
        },
        status: filters.status ? filters.status : undefined,
        bhkType: filters.bhk ? filters.bhk : undefined,
      },
      include: { tower: { include: { project: true } } },
    });
  }

  async create(dto: CreateUnitDto) {
    const tower = await this.prisma.tower.findFirst({
      where: { id: dto.towerId },
    });
    if (!tower) throw new NotFoundException('Tower not found or unauthorized');

    return this.prisma.unit.create({
      data: dto as any,
    });
  }

  async update(id: string, dto: UpdateUnitDto) {
    const unit = await this.prisma.unit.findFirst({
      where: { id },
    });
    if (!unit) throw new NotFoundException('Unit not found');

    return this.prisma.unit.update({
      where: { id },
      data: dto as any,
    });
  }

  async reserve(id: string, dto: ReserveUnitDto) {
    const unit = await this.prisma.unit.findFirst({
      where: { id },
    });
    if (!unit) throw new NotFoundException('Unit not found');
    if (unit.status !== UnitStatus.AVAILABLE) {
      throw new BadRequestException('Unit is not available for reservation');
    }

    return this.prisma.unit.update({
      where: { id },
      data: {
        status: UnitStatus.RESERVED,
        reservedForLeadId: dto.leadId,
        reservedUntil: dto.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      },
    });
  }

  async unreserve(id: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id },
    });
    if (!unit) throw new NotFoundException('Unit not found');

    return this.prisma.unit.update({
      where: { id },
      data: {
        status: UnitStatus.AVAILABLE,
        reservedForLeadId: null,
        reservedUntil: null,
      },
    });
  }

  async bulkUpdatePrice(filters: { towerId?: string; floor?: number }, basePrice: number) {
    return this.prisma.unit.updateMany({
      where: {
        towerId: filters.towerId,
        floor: filters.floor,
      },
      data: {
        basePrice,
      },
    });
  }
}
