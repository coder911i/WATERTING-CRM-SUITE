import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VisitBookingTool {
  constructor(private readonly prisma: PrismaService) {}

  getTool() {
    return new DynamicTool({
      name: 'visit_booking',
      description: 'Book a site visit for a lead. Input must be a valid JSON string: { "leadId": "string", "preferredDate": "YYYY-MM-DD", "preferredTime": "HH:MM" }',
      func: async (input: string) => {
        try {
          const parsed = JSON.parse(input);
          const { leadId, preferredDate, preferredTime } = parsed;

          const scheduledAt = new Date(`${preferredDate}T${preferredTime}:00`);

          const visit = await this.prisma.siteVisit.create({
            data: {
              leadId,
              scheduledAt,
              notes: 'Booked by AI Assistant',
            },
          });

          await this.prisma.activity.create({
            data: {
              leadId,
              type: 'VISIT_SCHEDULED',
              description: `Site visit booked by AI for ${scheduledAt.toLocaleString()}`,
            },
          });

          return `Successfully booked site visit for ${scheduledAt.toLocaleString()}`;
        } catch (e: any) {
          return `Error booking visit: ${e.message}`;
        }
      },
    });
  }
}
