import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PineconeService } from '../vector/pinecone.service';
import { LeadEmbedder } from '../vector/lead-embedder';
import OpenAI from 'openai';
import { getOpenAIClient, getModelName } from '../llm.provider';
import { RECOMMENDATION_SYSTEM_PROMPT } from '../prompts/recommendation.prompt';

@Injectable()
export class PropertyRecommendationAgent {
  private readonly logger = new Logger(PropertyRecommendationAgent.name);
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly pinecone: PineconeService,
    private readonly leadEmbedder: LeadEmbedder,
  ) {
    this.openai = getOpenAIClient();
  }

  async recommendProperties(leadId: string) {
    this.logger.log(`Generating recommendations for lead ${leadId}`);

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) throw new Error('Lead not found');

    // 1. Generate Vector triggers thresholds layout
    const vector = this.leadEmbedder.generateVector(lead);

    try {
      // 2. Query Pinecone triggers thresholds layout
      const matches = await this.pinecone.queryVectors(`${lead.tenantId}-units`, vector, 3);
      if (matches.length === 0) return { message: 'No matching properties found in vector space' };

      const unitIds = matches.map((m: { id: string }) => m.id);

      // 3. Fetch Units from Prisma thresholds triggers layout
      const units = await this.prisma.unit.findMany({
        where: { id: { in: unitIds } },
        include: { tower: { include: { project: true } } },
      });

      type RecommendedUnit = {
        unitNumber: string;
        bhkType: string;
        totalPrice: number;
        floor: number | null;
        tower: { name: string; project: { name: string } };
      };

      // 4. OpenAI Prompt thresholds triggers layout
      const prompt = `
Lead Profile:
- Budget: Up to ${lead.budgetMax}
- BHK Pref: ${lead.bhkPreference?.join(', ') || 'N/A'}

Top Matching Units from Vector Search:
${units.map((u: RecommendedUnit, i: number) => `${i+1}. ${u.tower.project.name} - ${u.tower.name} - Unit ${u.unitNumber} (${u.bhkType})
   Price: ${u.totalPrice} | Floor: ${u.floor}`).join('\n')}
`;

      const response = await this.openai.chat.completions.create({
        model: getModelName(),
        messages: [
          { role: 'system', content: RECOMMENDATION_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      });

      const justification = response.choices[0].message.content || 'Fits layout and budgets';

      // 5. Save Recommendation thresholds triggers layout
      const recommendation = await this.prisma.aiRecommendation.create({
        data: {
          tenantId: lead.tenantId,
          leadId: lead.id,
          unitIds: unitIds,
          justification,
        } as any, 
      });

      return {
        recommendationId: recommendation.id,
        units: units.map(u => ({ id: u.id, unitNumber: u.unitNumber, price: u.totalPrice })),
        justification,
      };

    } catch (e: any) {
      this.logger.error(`Recommendation failed for ${leadId}: ${e.message}`);
      throw e;
    }
  }
}
