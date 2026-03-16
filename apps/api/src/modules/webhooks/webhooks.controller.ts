import { Controller, Post, Body, Param, Logger, UseInterceptors } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';

@ApiTags('Webhooks')
@Controller('webhooks/:tenantId')
@UseInterceptors(TenantInterceptor)
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private leadsService: LeadsService) {}

  @Public()
  @Post('99acres')
  @ApiOperation({ summary: '99acres Lead Import' })
  async handle99Acres(@Param('tenantId') tenantId: string, @Body() body: any) {
    this.logger.log(`Received 99acres lead for tenant ${tenantId}`);
    // Simplified mapping
    return this.leadsService.create({
      name: body.name || '99acres Lead',
      phone: body.phone,
      email: body.email,
      source: 'PORTAL',
      projectInterest: body.project,
    } as any);
  }

  @Public()
  @Post('magicbricks')
  @ApiOperation({ summary: 'MagicBricks Lead Import' })
  async handleMagicBricks(@Param('tenantId') tenantId: string, @Body() body: any) {
    this.logger.log(`Received MagicBricks lead for tenant ${tenantId}`);
    return this.leadsService.create({
      name: body.Name || 'MagicBricks Lead',
      phone: body.Phone,
      email: body.Email,
      source: 'PORTAL',
      projectInterest: body.Project,
    } as any);
  }

  @Public()
  @Post('housing')
  @ApiOperation({ summary: 'Housing.com Lead Import' })
  async handleHousing(@Param('tenantId') tenantId: string, @Body() body: any) {
    this.logger.log(`Received Housing.com lead for tenant ${tenantId}`);
    return this.leadsService.create({
      name: body.user_name || 'Housing.com Lead',
      phone: body.user_phone,
      email: body.user_email,
      source: 'PORTAL',
      projectInterest: body.project_name,
    } as any);
  }
}
