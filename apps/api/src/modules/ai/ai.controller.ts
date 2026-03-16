import { Controller, Post, Param, Get, UseGuards, Req, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyRecommendationAgent } from './agents/property-recommendation.agent';
import { SalesCallingAgent } from './agents/sales-calling.agent';
import { AnalyticsAgent } from './agents/analytics.agent';
import { LeadDiscoveryAgent } from './agents/lead-discovery.agent';

@ApiTags('AI')
@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly recommendAgent: PropertyRecommendationAgent,
    private readonly salesAgent: SalesCallingAgent,
    private readonly analyticsAgent: AnalyticsAgent,
    private readonly discoveryAgent: LeadDiscoveryAgent,
  ) {}

  @Post('score/:leadId')
  @ApiOperation({ summary: 'Trigger scoring for one lead' })
  async scoreLead(@Param('leadId') leadId: string) {
    await this.aiService.triggerScoring(leadId);
    return { message: 'Scoring triggered successfully' };
  }

  @Post('score/batch')
  @ApiOperation({ summary: 'Score all unscored leads for tenant' })
  async scoreBatch() {
    const result = await this.aiService.triggerBatchScoring();
    return { message: 'Batch scoring triggered', count: result.count };
  }

  @Get('interactions/:leadId')
  @ApiOperation({ summary: 'All AI interactions for a lead' })
  async getInteractions(@Param('leadId') leadId: string) {
    return this.prisma.aiInteraction.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }
  @Post('recommend/:leadId')
  @ApiOperation({ summary: 'Generate recommendations for a lead' })
  async recommendProperties(@Param('leadId') leadId: string) {
    return this.recommendAgent.recommendProperties(leadId);
  }

  @Post('call/:leadId')
  @ApiOperation({ summary: 'Trigger AI outbound call for a lead' })
  async triggerCall(@Param('leadId') leadId: string) {
    return this.salesAgent.triggerCall(leadId);
  }

  @Post('call/webhook/:callId')
  @ApiOperation({ summary: 'Handle call webhook triggers' })
  async handleCallWebhook(@Param('callId') callId: string, @Body() body: any) {
    return this.salesAgent.handleWebhook(callId, body);
  }

  @Get('insights')
  @ApiOperation({ summary: 'List periodic AI insights' })
  async listInsights() {
    return (this.prisma as any).aiInsight.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('analytics/query')
  @ApiOperation({ summary: 'Ask analytics agent a question' })
  async queryAnalytics(@Body('question') question: string) {
    return this.analyticsAgent.runQuery(question);
  }

  @Post('discovery/trigger')
  @ApiOperation({ summary: 'Trigger AI lead discovery search' })
  async triggerDiscovery() {
    return this.discoveryAgent.runDiscovery();
  }
}
