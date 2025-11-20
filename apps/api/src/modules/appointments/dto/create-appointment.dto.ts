import { IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  tenantId: string;

  @IsUUID()
  professionalId: string;

  @IsUUID()
  serviceId: string;

  @IsUUID()
  customerId: string;

  @IsDateString()
  startTime: string;
}
