import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Processor('portals')
export class PortalsProcessor {
  private readonly logger = new Logger(PortalsProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsappService,
  ) {}

  @Process('import-lead')
  async handleImportLead(job: Job<any>) {
    const { source, payload } = job.data;
    this.logger.log(`Processing lead import from ${source}`);

    try {
      const phone = payload.phone || payload.mobile;
      const name = payload.name || 'Portal Lead';
      const email = payload.email;
      const tenantId = payload.tenantId; // Expected via webhook route params layout

      if (!phone || !tenantId) {
        this.logger.error(`Missing phone or tenantId for ${source} import`);
        return;
      }

      const formattedPhone = phone.replace('+', '').trim();

      // De-duplicate
      let lead = await this.prisma.lead.findFirst({
        where: { phone: { contains: formattedPhone }, tenantId },
      });

      if (lead) {
        this.logger.log(`Duplicate lead found for ${phone}, logging activity.`);
        await this.prisma.activity.create({
          data: {
            tenantId,
            leadId: lead.id,
            type: 'NOTE',
            description: `Duplicate lead received from ${source.replace('PORTAL_', '')}`,
          },
        });
        return;
      }

      // Create Lead
      lead = await this.prisma.lead.create({
        data: {
          tenantId,
          name,
          phone: formattedPhone,
          email: email || null,
          source: source as any,
          stage: 'NEW_LEAD',
          priority: 'NORMAL',
        },
      });

      this.logger.log(`Created new lead ${lead.id} from ${source}`);

      // Trigger Welcome WhatsApp
      await this.whatsapp.sendTemplateMessage(lead.id, 'NEW_LEAD_WELCOME');

    } catch (e: any) {
      this.logger.error(`Failed to process lead from ${source}: ${e.message}`);
    }
  }
}
