import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber, IsArray, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadSource, Priority } from '@prisma/client';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be in E.164 format' })
  phone!: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 10000000, required: false })
  @IsOptional()
  @IsNumber()
  budgetMin?: number;

  @ApiProperty({ example: 12000000, required: false })
  @IsOptional()
  @IsNumber()
  budgetMax?: number;

  @ApiProperty({ example: ['2 BHK'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bhkPreference?: string[];

  @ApiProperty({ enum: LeadSource, example: LeadSource.WEBSITE })
  @IsEnum(LeadSource)
  @IsNotEmpty()
  source!: LeadSource;

  @ApiProperty({ example: 'Website', required: false })
  @IsOptional()
  @IsString()
  sourceName?: string;

  @ApiProperty({ enum: Priority, example: Priority.MEDIUM, required: false })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({ example: 'Looking for a 2BHK', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'project_id_here', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;
}
