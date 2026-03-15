import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VisitOutcome } from '@prisma/client';

export class UpdateSiteVisitDto {
  @ApiProperty({ enum: VisitOutcome, example: VisitOutcome.INTERESTED })
  @IsEnum(VisitOutcome)
  @IsNotEmpty()
  outcome!: VisitOutcome;

  @ApiProperty({ example: 'Client liked the view.', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

