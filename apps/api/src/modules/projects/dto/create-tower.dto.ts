import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTowerDto {
  @ApiProperty({ example: 'Tower A' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  totalFloors!: number;
}
