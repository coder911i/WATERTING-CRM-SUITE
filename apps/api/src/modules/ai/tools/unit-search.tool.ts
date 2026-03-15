import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UnitSearchTool {
  constructor(private readonly prisma: PrismaService) {}

  getTool() {
    return new DynamicTool({
      name: 'unit_search',
      description: 'Search for available units matching criteria. Input must be a valid JSON string containing some or all properties: { "budget": number, "bhkType": "1BHK"|"2BHK"|"3BHK", "projectId": "string" }',
      func: async (input: string) => {
        try {
          const parsed = JSON.parse(input);
          const { budget, bhkType, projectId } = parsed;

          const units = await this.prisma.unit.findMany({
            where: {
              status: 'AVAILABLE',
              bhkType: bhkType ? { contains: bhkType.toUpperCase() } : undefined,
              totalPrice: budget ? { lte: budget + 1000000, gte: budget - 1000000 } : undefined,
              tower: projectId ? { projectId } : undefined,
            },
            take: 3,
            include: { tower: { include: { project: true } } },
          });

          if (units.length === 0) return 'No available units matching these requirements';
          return JSON.stringify(units.map(u => ({
            unitNumber: u.unitNumber,
            tower: u.tower.name,
            project: u.tower.project.name,
            price: u.totalPrice,
            floor: u.floor,
            bhkType: u.bhkType,
          })));
        } catch (e: any) {
          return `Error searching units: ${e.message}`;
        }
      },
    });
  }
}
