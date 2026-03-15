import { Injectable } from '@nestjs/common';
import { PineconeService } from './pinecone.service';

@Injectable()
export class LeadEmbedder {
  constructor(private readonly pinecone: PineconeService) {}

  async embedLead(tenantId: string, lead: any) {
    const vector = this.generateVector(lead);
    await this.pinecone.upsertVectors(`${tenantId}-leads`, [{
      id: lead.id,
      values: vector,
      metadata: { 
        name: lead.name, 
        budgetMax: lead.budgetMax, 
        stage: lead.stage 
      },
    }]);
  }

  generateVector(lead: any): number[] {
    const bhkMap: Record<string, number> = { '1BHK': 1, '2BHK': 2, '3BHK': 3, '4BHK': 4, '5BHK': 5 };
    const priorityMap: Record<string, number> = { 'LOW': 1, 'NORMAL': 2, 'HIGH': 3, 'URGENT': 4 };

    const bhkCode = lead.bhkPreference?.[0] ? (bhkMap[lead.bhkPreference[0].toUpperCase()] || 0) : 0;
    const priceNorm = (lead.budgetMax || 0) / 10000000; // normalized to 1 Cr
    
    // Urgency weight boost sizing triggers layout
    const urgency = priorityMap[lead.priority?.toUpperCase()] || 2; 

    const lat = lead.preferredLatitude || 0; 
    const lng = lead.preferredLongitude || 0;

    // Padding 0 for Floor and Facing dimensions triggers to maintain equal length metrics 
    return [bhkCode, priceNorm, 0, 0, lat, lng]; 
  }
}
