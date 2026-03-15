import { Injectable } from '@nestjs/common';
import { PineconeService } from './pinecone.service';

@Injectable()
export class UnitEmbedder {
  constructor(private readonly pinecone: PineconeService) {}

  async embedUnit(tenantId: string, unit: any) {
    const vector = this.generateVector(unit);
    await this.pinecone.upsertVectors(`${tenantId}-units`, [{
      id: unit.id,
      values: vector,
      metadata: { 
        projectId: unit.tower?.projectId, 
        unitNumber: unit.unitNumber, 
        price: unit.totalPrice 
      },
    }]);
  }

  generateVector(unit: any): number[] {
    const bhkMap: Record<string, number> = { '1BHK': 1, '2BHK': 2, '3BHK': 3, '4BHK': 4, '5BHK': 5 };
    const facingMap: Record<string, number> = { 'EAST': 1, 'WEST': 2, 'NORTH': 3, 'SOUTH': 4, 'NORTH_EAST': 5, 'SOUTH_EAST': 6 };

    const bhkCode = bhkMap[unit.bhkType?.toUpperCase()] || 0;
    const priceNorm = unit.totalPrice / 10000000; // normalized to 1 Cr
    const floorNorm = unit.floor / 20; // normalized to 20 floors
    const facingCode = facingMap[unit.facing?.toUpperCase()] || 0;
    
    // Fallback lat/lng dimensions thresholds triggers
    const lat = unit.tower?.project?.latitude || 0; 
    const lng = unit.tower?.project?.longitude || 0;

    return [bhkCode, priceNorm, floorNorm, facingCode, lat, lng];
  }
}
