import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createInstallment(bookingId: string, tenantId: string, dto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findFirst({ where: { id: bookingId, tenantId } });
    if (!booking) throw new NotFoundException('Booking not found or unauthorized');

    return this.prisma.payment.create({
      data: {
        bookingId,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        status: 'PENDING',
      },
    });
  }

  async createRazorpayOrder(paymentId: string, tenantId: string) {
    const payment = await this.prisma.payment.findFirst({ 
      where: { id: paymentId, booking: { tenantId } } 
    });
    if (!payment) throw new NotFoundException('Payment installment not found or unauthorized');

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
    });

    try {
      const order = await razorpay.orders.create({
        amount: Math.round(payment.amount * 100), // in paise
        currency: 'INR',
        receipt: `receipt_${payment.id}`,
      });

      // Update payment record with order ID
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: { razorpayOrderId: order.id },
      });

      return { orderId: order.id, amount: payment.amount };
    } catch (e: any) {
      throw new Error(`Razorpay Order creation failed: ${e.message}`);
    }
  }

  async findAllByBooking(bookingId: string, tenantId: string) {
    const booking = await this.prisma.booking.findFirst({ where: { id: bookingId, tenantId } });
    if (!booking) throw new NotFoundException('Booking not found or unauthorized');

    return this.prisma.payment.findMany({ where: { bookingId } });
  }
}
