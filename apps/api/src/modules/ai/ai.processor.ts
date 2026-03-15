import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { LeadScoringAgent } from './agents/lead-scoring.agent';

@Processor('ai')
export class AiProcessor {
  private readonly logger = new Logger(AiProcessor.name);

  constructor(private readonly leadScoringAgent: LeadScoringAgent) {}

  @Process('score-lead')
  async handleScoreLead(job: Job<{ leadId: string }>) {
    this.logger.log(`Processing score-lead job for ${job.data.leadId}`);
    try {
      await this.leadScoringAgent.scoreLead(job.data.leadId);
    } catch (e: any) {
      this.logger.error(`Failed to score lead ${job.data.leadId}: ${e.message}`);
      throw e;
    }
  }
}
