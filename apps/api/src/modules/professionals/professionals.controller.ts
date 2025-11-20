import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalsService.create(createProfessionalDto);
  }

  @Get(':tenantId')
  findByTenant(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.professionalsService.findByTenant(tenantId);
  }
}
