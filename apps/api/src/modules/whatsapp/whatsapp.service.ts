import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    @InjectQueue('whatsapp') private readonly whatsappQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async sendTemplateMessage(leadId: string, template: string, variables: any = {}) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead || !lead.phone) {
      this.logger.warn(`Lead ${leadId} has no phone number, skipping`);
      return;
    }

    if (lead.whatsappOptOut) {
      this.logger.log(`Lead ${leadId} has opted out of WhatsApp, skipping`);
      return;
    }

    await this.whatsappQueue.add('send-template', {
      leadId,
      phone: lead.phone,
      template,
      variables,
    });
    
    // Log to WhatsAppMessage table as SENT
    await this.prisma.whatsAppMessage.create({
      data: {
        tenantId: lead.tenantId,
        leadId: lead.id,
        direction: 'OUTBOUND',
        message: `Template: ${template}`,
        templateId: template,
        status: 'QUEUED',
      },
    });
  }
}
