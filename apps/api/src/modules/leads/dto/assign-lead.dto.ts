import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignLeadDto {
  @ApiProperty({ example: 'agent_id_here', required: false })
  @IsOptional()
  @IsString()
  agentId?: string;
}
