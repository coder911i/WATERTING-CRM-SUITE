import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty({ example: 'Skyline Heights' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Worli, Mumbai' })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Maharashtra', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ enum: ProjectType, example: ProjectType.RESIDENTIAL })
  @IsEnum(ProjectType)
  @IsNotEmpty()
  projectType!: ProjectType;

  @ApiProperty({ example: 'P51900012345', required: false })
  @IsOptional()
  @IsString()
  reraNumber?: string;

  @ApiProperty({ example: '2028-12-31', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  possessionDate?: Date;

  @ApiProperty({ example: ['Gym', 'Pool'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ example: ['img1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
