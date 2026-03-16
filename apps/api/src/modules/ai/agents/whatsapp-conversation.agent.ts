import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';
import { LeadLookupTool } from '../tools/lead-lookup.tool';
import { UnitSearchTool } from '../tools/unit-search.tool';
import { VisitBookingTool } from '../tools/visit-booking.tool';
import { CrmUpdateTool } from '../tools/crm-update.tool';
import { WHATSAPP_SYSTEM_PROMPT } from '../prompts/whatsapp.prompt';
import { DynamicTool } from '@langchain/core/tools';
import { PrismaService } from '../../prisma/prisma.service';
import { AiRedisService } from '../redis.service';

@Injectable()
export class WhatsappConversationAgent {
  private readonly logger = new Logger(WhatsappConversationAgent.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly leadLookup: LeadLookupTool,
    private readonly unitSearch: UnitSearchTool,
    private readonly visitBooking: VisitBookingTool,
    private readonly crmUpdate: CrmUpdateTool,
    private readonly redis: AiRedisService,
  ) {}

  async handleMessage(leadId: string, text: string) {
    this.logger.log(`Handling WA message for lead ${leadId}`);

    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new Error('Lead not found');
    const tenantId = lead.tenantId;

    // Load History from Redis thresholds triggers layout
    const history = await this.redis.getChatHistory(leadId);

    const model = new ChatOpenAI({
      openAIApiKey: process.env.NVIDIA_API_KEY || 'placeholder',
      configuration: { baseURL: 'https://integrate.api.nvidia.com/v1' },
      modelName: 'nvidia/llama-3.1-nemotron-70b-instruct',
      temperature: 0.7,
    });

    const escalateTool = new DynamicTool({
      name: 'escalate_to_human',
      description: 'Trigger this tool when the lead explicitly asks for a human, expresses frustration, or completed a site visit booking.',
      func: async () => {
        await this.prisma.lead.update({ where: { id: leadId }, data: { aiHandoffRequested: true } as any });
        return 'Successfully requested human handoff. Inform the user they will be connected shortly.';
      },
    });

    const tools = [
      this.leadLookup.getTool(),
      this.unitSearch.getTool(tenantId),
      this.visitBooking.getTool(),
      this.crmUpdate.getTool(),
      escalateTool,
    ];

    const agent = createAgent({
      llm: model as any,
      tools: tools as any,
      prompt: WHATSAPP_SYSTEM_PROMPT,
    } as any);

    // Save Incoming Message thresholds triggers layout
    await this.redis.saveMessage(leadId, 'user', text);

    // Prepare message payload
    const messages = history.map(m => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: text });

    try {
      const response = await agent.invoke({
        messages,
      });

      const lastMessage = response.messages[response.messages.length - 1];
      const reply = typeof lastMessage?.content === 'string' ? lastMessage.content : 'No response';

      // Save Outgoing Response thresholds triggers layout
      await this.redis.saveMessage(leadId, 'assistant', reply);

      return reply;

    } catch (e: any) {
      this.logger.error(`WA Agent failed for ${leadId}: ${e.message}`);
      throw e;
    }
  }
}
