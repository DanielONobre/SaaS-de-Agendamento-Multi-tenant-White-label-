import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Plan } from './plan.enum';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be a valid slug (e.g., my-tenant)',
  })
  slug: string;

  @IsOptional()
  @IsEnum(Plan)
  plan?: Plan;
}
