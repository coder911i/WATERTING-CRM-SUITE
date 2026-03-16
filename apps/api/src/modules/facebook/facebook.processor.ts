import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Processor('facebook')
export class FacebookProcessor {
  private readonly logger = new Logger(FacebookProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsappService,
  ) {}

  @Process('import-lead-fb')
  async handleImportLead(job: Job<any>) {
    const { tenantId, payload } = job.data;
    this.logger.log(`Processing Facebook lead import for tenant ${tenantId}`);

    try {
      // Simulation of webhook deep payloads mappings
      const phone = payload.phone; 
      const name = payload.name || 'Facebook Lead';
      const email = payload.email;

      if (!phone) {
        this.logger.error(`Missing phone in Facebook lead payload`);
        return;
      }

      const formattedPhone = phone.replace('+', '').trim();

      // De-duplicate
      let lead = await this.prisma.lead.findFirst({
        where: { phone: { contains: formattedPhone }, tenantId },
      });

      if (lead) {
        this.logger.log(`Duplicate Facebook lead found for ${phone}, logging activity.`);
        await this.prisma.activity.create({
          data: {
            tenantId,
            leadId: lead.id,
            type: 'NOTE',
            description: `Duplicate Facebook Lead submission logged`,
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
          source: 'FACEBOOK',
          stage: 'NEW',
          priority: 'MEDIUM',
        },
      });

      this.logger.log(`Created new lead ${lead.id} from Facebook`);

      // Trigger Welcome WhatsApp
      await this.whatsapp.sendTemplateMessage(lead.id, 'NEW_LEAD_WELCOME');

    } catch (e: any) {
      this.logger.error(`Failed to process Facebook lead: ${e.message}`);
    }
  }
}
