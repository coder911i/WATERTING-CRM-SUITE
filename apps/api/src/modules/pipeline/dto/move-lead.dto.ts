import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PipelineStage } from '@prisma/client';

export class MoveLeadDto {
  @ApiProperty({ enum: PipelineStage, example: PipelineStage.CONTACTED })
  @IsEnum(PipelineStage)
  @IsNotEmpty()
  stage!: PipelineStage;
}
