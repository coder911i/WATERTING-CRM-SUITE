import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';
import { SCORING_SYSTEM_PROMPT } from '../prompts/scoring.prompt';

@Injectable()
export class LeadScoringAgent {
  private readonly logger = new Logger(LeadScoringAgent.name);
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' });
  }

  async scoreLead(leadId: string) {
    this.logger.log(`Scoring lead ${leadId}`);

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: { 
        project: true, 
        activities: { take: 5, orderBy: { createdAt: 'desc' } } 
      },
    });

    if (!lead) throw new Error('Lead not found');

    const prompt = `
Lead Data:
- Name: ${lead.name}
- Budget: ${lead.budgetMin} - ${lead.budgetMax}
- Project: ${lead.project?.name || 'N/A'}
- Stage: ${lead.stage}
- Priority: ${lead.priority}
- Source: ${lead.source}
- Activities Count: ${lead.activities.length}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SCORING_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      this.logger.log(`Score for lead ${leadId}: ${result.score} (${result.label})`);

      // Update Lead
      await this.prisma.lead.update({
        where: { id: leadId },
        data: {
          aiScore: result.score,
          aiScoreLabel: result.label,
          nextFollowUpAt: result.suggestedAction?.includes('follow-up') ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
        },
      });

      // Log Interaction
      await this.prisma.aiInteraction.create({
        data: {
          tenantId: lead.tenantId,
          leadId: lead.id,
          agentType: 'SCORING',
          input: { leadId },
          output: result as any, // Cast to any for JSON column triggers
          tokensUsed: response.usage?.total_tokens || 0,
          modelUsed: 'gpt-4o',
        },
      });

      return result;

    } catch (e: any) {
      this.logger.error(`Scoring failed for lead ${leadId}: ${e.message}`);
      throw e;
    }
  }
}
