import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfessionalDto: CreateProfessionalDto) {
    const { tenantId, ...professionalData } = createProfessionalDto;

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found.`);
    }

    return this.prisma.professional.create({
      data: {
        ...professionalData,
        tenant: {
          connect: { id: tenantId },
        },
      },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.professional.findMany({
      where: {
        tenantId: tenantId,
      },
    });
  }
}
