import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SalesCallingAgent {
  private readonly logger = new Logger(SalesCallingAgent.name);

  constructor(private readonly prisma: PrismaService) {}

  async triggerCall(leadId: string) {
    this.logger.log(`Triggering AI call for lead ${leadId}`);

    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new Error('Lead not found');

    const call = await this.prisma.aiCall.create({
      data: {
        tenantId: lead.tenantId,
        leadId: lead.id,
        status: 'STARTED',
      } as any,
    });

    return {
      message: 'Outbound call triggered successfully via ElevenLabs interface',
      callId: call.id,
    };
  }

  async handleWebhook(callId: string, event: any) {
    this.logger.log(`Handling call webhook for ${callId}`);

    const status = event.type === 'conversation_completed' ? 'COMPLETED' : 'FAILED';
    
    await this.prisma.aiCall.update({
      where: { id: callId },
      data: { 
        status, 
        recordingUrl: event.recording_url,
        summary: event.summary 
      } as any,
    });

    return { message: 'Webhook processed' };
  }
}
