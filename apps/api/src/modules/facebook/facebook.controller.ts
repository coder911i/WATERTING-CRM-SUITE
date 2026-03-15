import { Controller, Post, Body, Logger, Get, Query, Param } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('webhooks/:tenantId/facebook')
export class FacebookController {
  private readonly logger = new Logger(FacebookController.name);

  constructor(@InjectQueue('facebook') private readonly facebookQueue: Queue) {}

  @Get()
  verifyWebhook(@Query('hub.mode') mode: string, @Query('hub.challenge') challenge: string) {
    this.logger.log(`Facebook webhook verification triggered`);
    return challenge;
  }

  @Post()
  async handleInbound(@Param('tenantId') tenantId: string, @Body() body: any) {
    this.logger.log(`Received Facebook Ads webhook for tenant ${tenantId}`);
    
    // Push to queue for async processing
    await this.facebookQueue.add('import-lead-fb', {
      tenantId,
      payload: body,
    });
    return { status: 'OK' };
  }
}
