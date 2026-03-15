import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateAndCreate(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { lead: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    
    const lead = await this.prisma.lead.findUnique({
      where: { id: booking.leadId }
    });

    if (!lead || !lead.brokerId) {
      return; // No broker attributed to this lead
    }

    const broker = await this.prisma.broker.findUnique({
      where: { id: lead.brokerId },
    });

    if (!broker) return;

    const commissionAmount = (booking.totalAmount * broker.commissionPct) / 100;

    return this.prisma.commission.create({
      data: {
        bookingId: booking.id,
        brokerId: broker.id,
        amount: commissionAmount,
        percentage: broker.commissionPct,
        status: 'PENDING',
      },
    });
  }
}
