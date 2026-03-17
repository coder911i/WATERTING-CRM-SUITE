import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';
import { getOpenAIClient, getModelName } from '../llm.provider';
import { DISCOVERY_SYSTEM_PROMPT } from '../prompts/lead-discovery.prompt';
import { tenantContextStorage } from '../../../common/context/tenant-context';

@Injectable()
export class LeadDiscoveryAgent {
  private readonly logger = new Logger(LeadDiscoveryAgent.name);
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = getOpenAIClient();
  }

  async runDiscovery() {
    const context = tenantContextStorage.getStore();
    const tenantId = context?.tenantId;
    
    this.logger.log(`Running Lead Discovery for tenant ${tenantId}`);

    const mockCrawlerResults = `
    [Post 1] Username: rahul_realestate
    Hi everyone, looking for a 3 BHK in Gurgaon near Golf Course Road. Budget is around 2.5 Cr. Any builder recommendation?
    
    [Post 2] Username: investor_deepak
    I am looking to buy 1000 sqft apartment. Renting out is my main goal. 
    
    [Post 3] Username: neha_sharma
    Want to buy a 2 BHK near Cyber City. Budget Max 1.2 Cr. Need immediate possession. Contact: neha.s@outlook.com
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: getModelName(),
        messages: [
          { role: 'system', content: DISCOVERY_SYSTEM_PROMPT.replace('You are an AI Lead Generation Specialist', 'You are an AI Lead Generation Specialist. Respond ONLY with a valid JSON object.') },
          { role: 'user', content: mockCrawlerResults },
        ],
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      const leads = parsed.leads || [];

      let createdCount = 0;
      for (const item of leads) {
        try {
          await this.prisma.lead.create({
            data: {
              tenantId,
              name: item.name || 'Discovered Lead',
              email: item.email || null,
              phone: item.contact || '0000000000',
              budgetMax: item.budgetMax ? parseFloat(item.budgetMax) : 0,
              source: 'FACEBOOK', 
              stage: 'NEW_LEAD',
            } as any,
          });
          createdCount++;
        } catch (dbError: any) {
          this.logger.error(`Failed to ingest discovered lead ${item.name}: ${dbError.message}`);
        }
      }

      return {
        message: 'Lead Discovery completed layout thresholds triggers layout managers',
        found: leads.length,
        created: createdCount,
        leads,
      };

    } catch (e: any) {
      this.logger.error(`Lead Discovery failed: ${e.message}`);
      throw e;
    }
  }
}
