import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class CreateBrokerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  reraNumber?: string;

  @IsString()
  @IsOptional()
  firmName?: string;

  @IsNumber()
  @IsOptional()
  commissionPct?: number;
}
