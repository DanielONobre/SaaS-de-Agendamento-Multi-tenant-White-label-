import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  durationMin: number;

  @IsNumber()
  price: number;

  @IsUUID()
  tenantId: string;
}
