import { IsString, IsNotEmpty, IsInt, IsOptional, IsNumber, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UnitStatus } from '@prisma/client';

export class CreateUnitDto {
  @ApiProperty({ example: 'tower_id_here' })
  @IsString()
  @IsNotEmpty()
  towerId!: string;

  @ApiProperty({ example: '101' })
  @IsString()
  @IsNotEmpty()
  unitNumber!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  floor!: number;

  @ApiProperty({ example: '2 BHK' })
  @IsString()
  @IsNotEmpty()
  bhkType!: string;

  @ApiProperty({ example: 850.5 })
  @IsNumber()
  carpetArea!: number;

  @ApiProperty({ example: 1200.0, required: false })
  @IsOptional()
  @IsNumber()
  superArea?: number;

  @ApiProperty({ example: 'East', required: false })
  @IsOptional()
  @IsString()
  facing?: string;

  @ApiProperty({ example: 10000000 })
  @IsNumber()
  basePrice!: number;

  @ApiProperty({ example: 11000000 })
  @IsNumber()
  totalPrice!: number;

  @ApiProperty({ enum: UnitStatus, example: UnitStatus.AVAILABLE, required: false })
  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;
}
