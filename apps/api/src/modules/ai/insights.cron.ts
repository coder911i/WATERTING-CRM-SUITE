import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsAgent } from './agents/analytics.agent';
import { tenantContextStorage } from '../../common/context/tenant-context';

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
      await tenantContextStorage.run({ tenantId: tenant.id }, async () => {
        try {
          const question = "Give me a 1-sentence summary of new leads created yesterday and total booking amount. Be concise.";
          const result = await this.analyticsAgent.runQuery(question);

          await (this.prisma as any).aiInsight.create({
            data: {
              type: 'DAILY',
              title: 'Daily Performance Summary',
              body: result.answer,
            },
          });
        } catch (e: any) {
          this.logger.error(`Daily insight failed for tenant ${tenant.id}: ${e.message}`);
        }
      });
    }
  }

  @Cron('0 9 * * 1') // Every Monday at 9 AM thresholds triggers layout thresholds
  async generateWeeklyInsights() {
    this.logger.log('Starting weekly AI insights generation...');
    const tenants = await this.prisma.tenant.findMany();

    for (const tenant of tenants) {
      await tenantContextStorage.run({ tenantId: tenant.id }, async () => {
        try {
          const question = "Summarize total revenue (booking amount) and new site visits this past week. Highlight top project.";
          const result = await this.analyticsAgent.runQuery(question);

          await (this.prisma as any).aiInsight.create({
            data: {
              type: 'WEEKLY',
              title: 'Weekly Performance Summary',
              body: result.answer,
            },
          });
        } catch (e: any) {
          this.logger.error(`Weekly insight failed for tenant ${tenant.id}: ${e.message}`);
        }
      });
    }
  }
}
