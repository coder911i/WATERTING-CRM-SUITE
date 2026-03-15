import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CrmUpdateTool {
  constructor(private readonly prisma: PrismaService) {}

  getTool() {
    return new DynamicTool({
      name: 'crm_update',
      description: 'Update lead fields in CRM. Input must be a valid JSON string: { "leadId": "string", "field": "budgetMin"|"budgetMax"|"notes", "value": "any" }',
      func: async (input: string) => {
        try {
          const parsed = JSON.parse(input);
          const { leadId, field, value } = parsed;

          const allowedFields = ['budgetMin', 'budgetMax', 'notes'];
          if (!allowedFields.includes(field)) return `Field ${field} is not editable via AI`;

          await this.prisma.lead.update({
            where: { id: leadId },
            data: { [field]: value },
          });

          await this.prisma.activity.create({
            data: {
              leadId,
              type: 'SYSTEM',
              description: `AI updated field ${field} to ${value}`,
            },
          });

          return `Successfully updated ${field} to ${value}`;
        } catch (e: any) {
          return `Error updating CRM: ${e.message}`;
        }
      },
    });
  }
}
