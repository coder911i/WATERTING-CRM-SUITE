import { Controller, Post, Body, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { PortalService } from './portal.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Portal')
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Public()
  @Post('request-otp')
  @ApiOperation({ summary: 'Request 6-digit OTP for login' })
  async requestOtp(@Body() dto: { phone: string; tenantId: string }) {
    return this.portalService.requestOtp(dto.phone, dto.tenantId);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and return token' })
  async verifyOtp(@Body() dto: { phone: string; otp: string; tenantId: string }) {
    return this.portalService.verifyOtp(dto.phone, dto.otp, dto.tenantId);
  }

  @Get('dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get client dashboard details' })
  async getDashboard(@CurrentUser() user: any) {
    if (user.role !== 'CLIENT') {
      throw new UnauthorizedException('Access denied');
    }
    return this.portalService.getDashboardData(user.id);
  }
}
