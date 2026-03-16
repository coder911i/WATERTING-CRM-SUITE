import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

import { AutomationAction } from '@prisma/client';
@Processor('automation')
export class AutomationProcessor {
  private readonly logger = new Logger(AutomationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsappService,
  ) {}

  @Process('execute-automation')
  async handleExecuteAutomation(job: Job<any>) {
    const { automationId, context } = job.data;
    this.logger.log(`Executing automation ${automationId}`);

    const automation = await this.prisma.automation.findUnique({
      where: { id: automationId },
    });

    if (!automation || !automation.isEnabled) return;

    try {
      // 1. Evaluate Conditions
      const conditions = (automation.conditions as any[]) || [];
      let matches = true;
      
      for (const cond of conditions) {
        if (!this.evaluateCondition(cond, context)) {
          matches = false;
          break;
        }
      }

      if (!matches) {
        this.logger.log(`Automation ${automationId} conditions not met`);
        return;
      }

      // 2. Execute Actions
      const actions = (automation.actions as any[]) || [];
      for (const action of actions) {
        await this.executeAction(action, context, automation.tenantId);
      }

      // 3. Log execution
      await this.prisma.automationLog.create({
        data: {
          tenantId: automation.tenantId,
          automationId,
          leadId: context.leadId || context.id || null,
          status: 'SUCCESS',
          output: { executedActions: actions.map((a: { type: AutomationAction; payload?: any }) => a.type) },
        },
      });

      await this.prisma.automation.update({
        where: { id: automationId },
        data: { runCount: { increment: 1 }, lastRunAt: new Date() },
      });

    } catch (e: any) {
      this.logger.error(`Automation ${automationId} failed: ${e.message}`);
      await this.prisma.automationLog.create({
        data: {
          tenantId: automation.tenantId,
          automationId,
          leadId: context.leadId || context.id || null,
          status: 'FAILED',
          output: { error: e.message },
        },
      });
    }
  }

  private evaluateCondition(cond: any, context: any): boolean {
    const { field, operator, value } = cond;
    const actual = context[field];
    
    if (operator === 'EQUALS') return actual === value;
    if (operator === 'CONTAINS') return String(actual).includes(value);
    
    return false;
  }

  private async executeAction(action: any, context: any, tenantId: string) {
    const { type, payload } = action;

    if (type === 'SEND_WHATSAPP') {
      const leadId = context.leadId || context.id;
      if (leadId) {
        await this.whatsapp.sendTemplateMessage(leadId, payload.template);
      }
    } else if (type === 'UPDATE_STAGE') {
      const leadId = context.leadId || context.id;
      if (leadId) {
        await this.prisma.lead.update({
          where: { id: leadId },
          data: { stage: payload.stage },
        });
      }
    }
  }
}
