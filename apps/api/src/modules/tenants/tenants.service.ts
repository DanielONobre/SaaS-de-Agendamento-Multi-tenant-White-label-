import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    const tenantExists = await this.prisma.tenant.findUnique({
      where: {
        slug: createTenantDto.slug,
      },
    });

    if (tenantExists) {
      throw new ConflictException('Tenant with this slug already exists.');
    }

    return this.prisma.tenant.create({
      data: createTenantDto,
    });
  }

  findAll() {
    return this.prisma.tenant.findMany();
  }
}
