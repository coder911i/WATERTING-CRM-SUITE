import { Controller, Post, Body, Logger, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhooks/whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  verifyWebhook(@Query('hub.mode') mode: string, @Query('hub.challenge') challenge: string) {
    // Meta requires get challenge validation
    this.logger.log(`Meta webhook verified successfully.`);
    return challenge;
  }

  @Post()
  async handleInbound(@Body() body: any) {
    this.logger.log(`Received WhatsApp inbound webhook payload`);
    
    try {
      // 1. Simulate parsing Meta typical nested JSON payload Structure
      // body.entry[0].changes[0].value.messages[0]
      const messageObj = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (!messageObj) return { status: 'OK' };

      const phone = messageObj.from;
      const text = messageObj.text?.body?.trim();
      if (!phone || !text) return { status: 'OK' };

      // 2. Find Lead by Phone
      const lead = await this.prisma.lead.findFirst({
        where: { phone: { contains: phone.replace('+', '') } },
      });

      if (!lead) {
        this.logger.warn(`Inbound message from unknown number: ${phone}`);
        return { status: 'OK' };
      }

      // 3. Check for STOP trigger
      if (text.toUpperCase() === 'STOP') {
        await this.prisma.lead.update({
          where: { id: lead.id },
          data: { whatsappOptOut: true },
        });
        this.logger.log(`Lead ${lead.id} opted out of WhatsApp.`);
      }

      // 4. Record WhatsAppMessage
      await this.prisma.whatsAppMessage.create({
        data: {
          tenantId: lead.tenantId,
          leadId: lead.id,
          direction: 'INBOUND',
          message: text,
          status: 'RECEIVED',
        },
      });

      // 5. Update Lead lastActivityAt
      await this.prisma.lead.update({
        where: { id: lead.id },
        data: { lastActivityAt: new Date() },
      });

      return { status: 'OK' };
    } catch (e: any) {
      this.logger.error(`Failed to parse inbound webhook: ${e.message}`);
      return { status: 'ERROR' };
    }
  }
}
