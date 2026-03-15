import { Controller, Post, Body, Logger, Headers, Param } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('webhooks/:tenantId')
export class PortalsController {
  private readonly logger = new Logger(PortalsController.name);

  constructor(@InjectQueue('portals') private readonly portalsQueue: Queue) {}

  @Post('99acres')
  async handle99Acres(
    @Param('tenantId') tenantId: string,
    @Body() body: any,
    @Headers('x-signature') signature: string,
  ) {
    this.logger.log(`Received 99acres webhook for tenant ${tenantId}`);
    
    await this.portalsQueue.add('import-lead', {
      source: 'PORTAL_99ACRES',
      payload: { ...body, tenantId },
    });
    return { status: 'OK' };
  }

  @Post('magicbricks')
  async handleMagicBricks(
    @Param('tenantId') tenantId: string,
    @Body() body: any,
    @Headers('x-signature') signature: string,
  ) {
    this.logger.log(`Received MagicBricks webhook for tenant ${tenantId}`);
    
    await this.portalsQueue.add('import-lead', {
      source: 'PORTAL_MAGICBRICKS',
      payload: { ...body, tenantId },
    });
    return { status: 'OK' };
  }
}
