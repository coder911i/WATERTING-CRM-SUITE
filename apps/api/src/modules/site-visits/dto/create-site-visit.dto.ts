import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSiteVisitDto {
  @ApiProperty({ example: 'lead_id_here' })
  @IsString()
  @IsNotEmpty()
  leadId!: string;

  @ApiProperty({ example: '2026-12-31T10:00:00Z' })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  scheduledAt!: Date;

  @ApiProperty({ example: 'Client wants to see the 10th floor view.' })
  @IsString()
  @IsOptional()
  notes?: string;
}

