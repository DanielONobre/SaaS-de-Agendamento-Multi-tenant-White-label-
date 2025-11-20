import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get(':tenantId')
  findByTenant(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.servicesService.findByTenant(tenantId);
  }
}
