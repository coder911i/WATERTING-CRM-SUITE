import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { PortalService } from './portal.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

class RequestOtpDto {
  phone!: string;
}

class VerifyOtpDto {
  phone!: string;
  otp!: string;
}

@ApiTags('Portal')
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request 6-digit OTP for login' })
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.portalService.requestOtp(dto.phone);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and return token' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.portalService.verifyOtp(dto.phone, dto.otp);
  }

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get client dashboard details' })
  async getDashboard(@Body() body: any, @Req() req: any) { // fallback parsing if CurrentUser decorator causes import stress
    const user = req.user;
    if (user.role !== 'CLIENT') {
      throw new UnauthorizedException('Access denied');
    }
    return this.portalService.getDashboardData(user.id);
  }
}
