import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentMethod } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('booking/:bookingId')
  @ApiOperation({ summary: 'Add installment schedule' })
  async createInstallment(@Param('bookingId') bookingId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createInstallment(bookingId, dto);
  }

  @Post(':id/manual')
  @ApiOperation({ summary: 'Record manual payment (UPI/Cheque/etc)' })
  async recordManualPayment(
    @Param('id') id: string,
    @Body() dto: { method: PaymentMethod; referenceNumber: string; receiptUrl?: string; paidAt?: Date }
  ) {
    return this.paymentsService.recordManualPayment(id, dto);
  }

  @Post(':id/create-razorpay-order')
  @ApiOperation({ summary: 'Generate Razorpay Order for installment' })
  async createRazorpayOrder(@Param('id') id: string) {
    return this.paymentsService.createRazorpayOrder(id);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'List installments for a booking' })
  async findAllByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.findAllByBooking(bookingId);
  }
}
