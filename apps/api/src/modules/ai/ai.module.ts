import { Module } from '@nestjs/common';
import { PineconeService } from './vector/pinecone.service';
import { UnitEmbedder } from './vector/unit-embedder';
import { LeadEmbedder } from './vector/lead-embedder';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiProcessor } from './ai.processor';
import { LeadScoringAgent } from './agents/lead-scoring.agent';
import { WhatsappConversationAgent } from './agents/whatsapp-conversation.agent';
import { LeadLookupTool } from './tools/lead-lookup.tool';
import { UnitSearchTool } from './tools/unit-search.tool';
import { VisitBookingTool } from './tools/visit-booking.tool';
import { CrmUpdateTool } from './tools/crm-update.tool';
import { AiRedisService } from './redis.service';
import { PropertyRecommendationAgent } from './agents/property-recommendation.agent';
import { SalesCallingAgent } from './agents/sales-calling.agent';
import { AnalyticsAgent } from './agents/analytics.agent';
import { InsightsCron } from './insights.cron';
import { LeadDiscoveryAgent } from './agents/lead-discovery.agent';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'ai' }),
  ],
  controllers: [AiController],
  providers: [
    AiService, 
    AiProcessor, 
    PineconeService, 
    UnitEmbedder, 
    LeadEmbedder, 
    LeadScoringAgent, 
    WhatsappConversationAgent,
    LeadLookupTool,
    UnitSearchTool,
    VisitBookingTool,
    CrmUpdateTool,
    AiRedisService,
    PropertyRecommendationAgent,
    SalesCallingAgent,
    AnalyticsAgent,
    InsightsCron,
    LeadDiscoveryAgent,
  ],
  exports: [AiService, PineconeService, UnitEmbedder, LeadEmbedder, PropertyRecommendationAgent],
})
export class AiModule {}
