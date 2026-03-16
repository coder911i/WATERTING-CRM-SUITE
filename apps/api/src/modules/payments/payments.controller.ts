import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('booking/:bookingId')
  @ApiOperation({ summary: 'Add installment schedule' })
  async createInstallment(@Param('bookingId') bookingId: string, @CurrentUser() user: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createInstallment(bookingId, user.tenantId, dto);
  }

  @Post(':id/create-razorpay-order')
  @ApiOperation({ summary: 'Generate Razorpay Order for installment' })
  async createRazorpayOrder(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentsService.createRazorpayOrder(id, user.tenantId);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'List installments for a booking' })
  async findAllByBooking(@Param('bookingId') bookingId: string, @CurrentUser() user: any) {
    return this.paymentsService.findAllByBooking(bookingId, user.tenantId);
  }
}
