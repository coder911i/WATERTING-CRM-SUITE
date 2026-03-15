import { Controller, Post, Param, Get, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyRecommendationAgent } from './agents/property-recommendation.agent';

@ApiTags('AI')
@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly recommendAgent: PropertyRecommendationAgent,
  ) {}

  @Post('score/:leadId')
  @ApiOperation({ summary: 'Trigger scoring for one lead' })
  async scoreLead(@Param('leadId') leadId: string) {
    await this.aiService.triggerScoring(leadId);
    return { message: 'Scoring triggered successfully' };
  }

  @Post('score/batch')
  @ApiOperation({ summary: 'Score all unscored leads for tenant' })
  async scoreBatch(@Req() req: any) {
    const tenantId = req.user.tenantId;
    const result = await this.aiService.triggerBatchScoring(tenantId);
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
}
