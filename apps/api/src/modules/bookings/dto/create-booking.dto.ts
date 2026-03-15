import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  leadId!: string;

  @IsString()
  @IsNotEmpty()
  unitId!: string;

  @IsNumber()
  @IsNotEmpty()
  tokenAmount!: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
