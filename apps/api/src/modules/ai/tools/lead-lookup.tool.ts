import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeadLookupTool {
  constructor(private readonly prisma: PrismaService) {}

  getTool() {
    return new DynamicTool({
      name: 'lead_lookup',
      description: 'Look up full lead profile including budget preference and past interactions. Input must be a valid leadId string.',
      func: async (leadId: string) => {
        try {
          const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
            include: { activities: { take: 5, orderBy: { createdAt: 'desc' } } },
          });
          if (!lead) return 'Lead not found';
          return JSON.stringify({
            name: lead.name,
            phone: lead.phone,
            budgetMin: lead.budgetMin,
            budgetMax: lead.budgetMax,
            bhkPreference: lead.bhkPreference,
            stage: lead.stage,
            notes: lead.notes,
            activities: lead.activities.map(a => `${a.type}: ${a.description}`),
          });
        } catch (e: any) {
          return `Error looking up lead: ${e.message}`;
        }
      },
    });
  }
}
