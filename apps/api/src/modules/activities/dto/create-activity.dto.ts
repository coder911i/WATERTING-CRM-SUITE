import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '@prisma/client';

export class CreateActivityDto {
  @ApiProperty({ enum: ActivityType, example: ActivityType.CALL })
  @IsEnum(ActivityType)
  @IsNotEmpty()
  type!: ActivityType;

  @ApiProperty({ example: 'Called client, discussed budget.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: { duration: '5m' }, required: false })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
