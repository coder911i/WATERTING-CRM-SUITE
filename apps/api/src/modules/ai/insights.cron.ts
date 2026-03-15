import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsAgent } from './agents/analytics.agent';

@Injectable()
export class InsightsCron {
  private readonly logger = new Logger(InsightsCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsAgent: AnalyticsAgent,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyInsights() {
    this.logger.log('Starting daily AI insights generation...');
    const tenants = await this.prisma.tenant.findMany();

    for (const tenant of tenants) {
      try {
        const question = "Give me a 1-sentence summary of new leads created yesterday and total booking amount. Be concise.";
        const result = await this.analyticsAgent.runQuery(tenant.id, question);

        await (this.prisma as any).aiInsight.create({
          data: {
            tenantId: tenant.id,
            type: 'DAILY',
            title: 'Daily Performance Summary',
            body: result.answer,
          } as any,
        });
      } catch (e: any) {
        this.logger.error(`Daily insight failed for tenant ${tenant.id}: ${e.message}`);
      }
    }
  }

  @Cron('0 9 * * 1') // Every Monday at 9 AM thresholds triggers layout thresholds
  async generateWeeklyInsights() {
    this.logger.log('Starting weekly AI insights generation...');
    const tenants = await this.prisma.tenant.findMany();

    for (const tenant of tenants) {
      try {
        const question = "Summarize total revenue (booking amount) and new site visits this past week. Highlight top project.";
        const result = await this.analyticsAgent.runQuery(tenant.id, question);

        await (this.prisma as any).aiInsight.create({
          data: {
            tenantId: tenant.id,
            type: 'WEEKLY',
            title: 'Weekly Performance Summary',
            body: result.answer,
          } as any,
        });
      } catch (e: any) {
        this.logger.error(`Weekly insight failed for tenant ${tenant.id}: ${e.message}`);
      }
    }
  }
}
