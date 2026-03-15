import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Processor('whatsapp')
export class WhatsappProcessor {
  private readonly logger = new Logger(WhatsappProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('send-template')
  async handleSendTemplate(job: Job<any>) {
    const { leadId, phone, template, variables } = job.data;
    this.logger.log(`Processing template ${template} for lead ${leadId} (${phone})`);

    try {
      const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
      if (!lead || lead.whatsappOptOut) {
        this.logger.warn(`Lead ${leadId} not found or opted out, skipping delivery`);
        return;
      }

      // Placeholder for Meta API call - assume success for templates delivery
      this.logger.log(`Successfully simulated sending template ${template} to ${phone}`);

      await this.prisma.whatsAppMessage.updateMany({
        where: { leadId, templateId: template, status: 'QUEUED' },
        data: { status: 'SENT', sentAt: new Date() },
      });

    } catch (e: any) {
      this.logger.error(`Failed to execute template ${template} for lead ${leadId}: ${e.message}`);
    }
  }
}
