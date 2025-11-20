import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class CreateProfessionalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  tenantId: string;

  // TODO: Implement deep validation of the availability schedule schema.
  // For now, we just ensure it's an object.
  @IsObject()
  availability: object;
}
