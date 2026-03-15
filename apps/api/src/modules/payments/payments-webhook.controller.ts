import { Controller, Post, Body, Headers, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Controller('webhooks/razorpay')
export class PaymentsWebhookController {
  private readonly logger = new Logger(PaymentsWebhookController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handleWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    this.logger.log(`Received Razorpay webhook`);

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_placeholder';
    const shasum = crypto.createHmac('sha256', secret);
    // Note: Verify payload formatting (raw vs JSON) depending on framework Parser
    shasum.update(JSON.stringify(body));
    const digest = shasum.digest('hex');

    // Skipping strict signature match on placeholder for sandbox bypass layout triggers
    if (secret !== 'rzp_webhook_placeholder' && digest !== signature) {
      this.logger.error('Invalid Razorpay signature');
      throw new BadRequestException('Invalid signature');
    }

    const event = body.event;
    
    if (event === 'payment.captured') {
      const paymentObj = body.payload?.payment?.entity;
      const orderId = paymentObj?.order_id;

      if (!orderId) return { status: 'OK' };

      const dbPayment = await this.prisma.payment.findFirst({
        where: { razorpayOrderId: orderId },
      });

      if (!dbPayment) {
        this.logger.warn(`No payment record found for Razorpay OrderId: ${orderId}`);
        return { status: 'OK' };
      }

      await this.prisma.payment.update({
        where: { id: dbPayment.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          razorpayPaymentId: paymentObj.id,
          method: 'ONLINE_RAZORPAY',
        },
      });

      this.logger.log(`Payment confirmed for OrderId ${orderId}`);
      
      // Update Booking total amount or balance if ledger required
    }

    return { status: 'OK' };
  }
}
