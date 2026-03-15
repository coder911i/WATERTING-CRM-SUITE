import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CommissionsService } from '../brokers/commissions.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commissionsService: CommissionsService,
    private readonly whatsapp: WhatsappService,
  ) {}

  async create(tenantId: string, dto: CreateBookingDto) {
    const unit = await this.prisma.unit.findUnique({ where: { id: dto.unitId } });
    if (!unit) throw new NotFoundException('Unit not found');

    if (unit.status !== 'AVAILABLE' && unit.status !== 'RESERVED') {
      throw new BadRequestException('Unit is not available for booking');
    }

    // Create Booking
    const booking = await this.prisma.booking.create({
      data: {
        tenantId,
        leadId: dto.leadId,
        unitId: dto.unitId,
        tokenAmount: dto.tokenAmount,
        totalAmount: dto.totalAmount,
        notes: dto.notes || null,
      },
    });

    // Update Unit status
    await this.prisma.unit.update({
      where: { id: dto.unitId },
      data: { status: 'BOOKED' },
    });

    // Calculate Commission
    try {
      await this.commissionsService.calculateAndCreate(booking.id);
    } catch (e: any) {
      // Don't fail booking if commission creation fails
    }

    // Send WhatsApp confirmation
    try {
      await this.whatsapp.sendTemplateMessage(dto.leadId, 'BOOKING_CONFIRMATION');
    } catch (e: any) {
      // Don't fail booking if whatsapp triggers fail
    }

    // Log Activity
    await this.prisma.activity.create({
      data: {
        leadId: dto.leadId,
        type: 'NOTE',
        description: `Booking created for Unit ID: ${dto.unitId}`,
      },
    });

    return booking;
  }

  async findAll(tenantId: string) {
    return this.prisma.booking.findMany({
      where: { tenantId },
      include: { 
        lead: { select: { name: true, phone: true } }, 
        unit: { select: { unitNumber: true, totalPrice: true } } 
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { lead: true, unit: true, payments: true },
    });
  }
}
