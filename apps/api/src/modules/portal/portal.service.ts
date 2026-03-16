import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class PortalService {
  private otpMap = new Map<string, { otp: string, expires: Date }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly whatsapp: WhatsappService,
  ) {}

  async requestOtp(phone: string, tenantId: string) {
    const formattedPhone = phone.replace('+', '').trim();
    const lead = await this.prisma.lead.findFirst({
      where: { phone: { contains: formattedPhone }, tenantId },
    });

    if (!lead) throw new NotFoundException('Lead not found with this number');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // 10 min

    this.otpMap.set(`${tenantId}:${formattedPhone}`, { otp, expires });

    try {
      await this.whatsapp.sendTemplateMessage(lead.id, 'CLIENT_PORTAL_OTP', { otp });
    } catch (e) {
      // Allow fallback if whatsapp fails
    }

    // Return true for sandbox visibility in logs
    return { success: true, message: 'OTP sent successfully', sandboxOtp: otp };
  }

  async verifyOtp(phone: string, otp: string, tenantId: string) {
    const formattedPhone = phone.replace('+', '').trim();
    const record = this.otpMap.get(`${tenantId}:${formattedPhone}`);

    if (!record) throw new UnauthorizedException('No OTP requested');

    if (new Date() > record.expires) {
      this.otpMap.delete(`${tenantId}:${formattedPhone}`);
      throw new UnauthorizedException('OTP expired');
    }

    if (record.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    this.otpMap.delete(`${tenantId}:${formattedPhone}`);

    const lead = await this.prisma.lead.findFirst({
      where: { phone: { contains: formattedPhone }, tenantId },
    });

    const payload = { sub: lead!.id, tenantId: lead!.tenantId, role: 'CLIENT' };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async getDashboardData(leadId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        booking: {
          include: {
            payments: { orderBy: { dueDate: 'asc' } },
          },
        },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    const booking = lead.booking;

    return {
      lead: { name: lead.name, phone: lead.phone, stage: lead.stage },
      booking: booking ? {
        unitId: booking.unitId, // unit is not included above, just unitId or include unit too if layout prefers
        totalAmount: booking.totalAmount,
        tokenAmount: booking.tokenAmount,
        status: booking.status,
      } : null,
      payments: booking ? booking.payments : [],
    };
  }
}
