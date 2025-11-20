import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    const { tenantId, ...serviceData } = createServiceDto;

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found.`);
    }

    return this.prisma.service.create({
      data: {
        ...serviceData,
        tenant: {
          connect: { id: tenantId },
        },
      },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.service.findMany({
      where: {
        tenantId: tenantId,
      },
    });
  }
}
