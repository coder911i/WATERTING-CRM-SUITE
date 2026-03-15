import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReserveUnitDto {
  @ApiProperty({ example: 'lead_id_here' })
  @IsString()
  @IsNotEmpty()
  leadId!: string;

  @ApiProperty({ example: '2026-12-31', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;
}
