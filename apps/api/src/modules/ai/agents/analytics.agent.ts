import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';
import { DynamicTool } from '@langchain/core/tools';
import { ANALYTICS_SYSTEM_PROMPT } from '../prompts/analytics.prompt';

@Injectable()
export class AnalyticsAgent {
  private readonly logger = new Logger(AnalyticsAgent.name);

  constructor(private readonly prisma: PrismaService) {}

  async runQuery(tenantId: string, question: string) {
    this.logger.log(`Running analytics query for tenant ${tenantId}`);

    const model = new ChatOpenAI({
      openAIApiKey: process.env.NVIDIA_API_KEY || 'placeholder',
      configuration: { baseURL: 'https://integrate.api.nvidia.com/v1' },
      modelName: 'nvidia/llama-3.1-nemotron-70b-instruct',
      temperature: 0.2, 
    });

    const sqlTool = new DynamicTool({
      name: 'execute_sql',
      description: 'Run an SQL SELECT query on the database to answer aggregated statistics. Input MUST be a valid SQL SELECT string.',
      func: async (sql: string) => {
        const cleaned = sql.trim();
        if (!cleaned.toUpperCase().startsWith('SELECT')) {
          return 'Error: Only SELECT queries are permitted for safety policies thresholds triggers layout managers.';
        }
        try {
          const result = await this.prisma.$queryRawUnsafe(cleaned);
          return JSON.stringify(result);
        } catch (e: any) {
          return `SQL Error: ${e.message}`;
        }
      },
    });

    const agent = createAgent({
      llm: model as any,
      tools: [sqlTool] as any,
      prompt: ANALYTICS_SYSTEM_PROMPT,
    } as any);

    try {
      const response = await agent.invoke({
        messages: [{ role: 'user', content: `[Tenant ID: ${tenantId}] Question: ${question}` }],
      });

      const lastMessage = response.messages[response.messages.length - 1];
      const answer = typeof lastMessage?.content === 'string' ? lastMessage.content : 'No summary generated';

      return {
        answer,
      };

    } catch (e: any) {
      this.logger.error(`Analytics Agent failed: ${e.message}`);
      throw e;
    }
  }
}
