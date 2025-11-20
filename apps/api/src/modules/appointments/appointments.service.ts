import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { serviceId, professionalId, customerId, tenantId, startTime } =
      createAppointmentDto;

    // Passo A: Busque o Service para obter a duração.
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found.`);
    }

    // Passo B: Calcule o horário de término.
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(
      newStartTime.getTime() + service.durationMin * 60000, // Converte minutos para milissegundos
    );

    // Passo C: Validação de Conflito com a lógica de Overlap.
    // A consulta busca por qualquer agendamento existente para o mesmo profissional
    // que se sobreponha ao novo horário solicitado.
    // A fórmula é: O agendamento existente começa ANTES do novo terminar,
    // E o agendamento existente termina DEPOIS do novo começar.
    const conflictingAppointment = await this.prisma.appointment.findFirst({
      where: {
        professionalId: professionalId,
        status: { not: 'CANCELED' },
        AND: [
          {
            startTime: {
              lt: newEndTime, // lt = less than
            },
          },
          {
            endTime: {
              gt: newStartTime, // gt = greater than
            },
          },
        ],
      },
    });

    // Passo D: Se houver conflito, lance uma exceção. Senão, crie o agendamento.
    if (conflictingAppointment) {
      throw new ConflictException(
        'The professional is unavailable at this time slot due to a conflicting appointment.',
      );
    }

    return this.prisma.appointment.create({
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
        status: 'CONFIRMED', // Status padrão
        tenant: { connect: { id: tenantId } },
        professional: { connect: { id: professionalId } },
        service: { connect: { id: serviceId } },
        customer: { connect: { id: customerId } },
      },
    });
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.appointment.findMany({
      where: { tenantId },
      include: {
        professional: true,
        service: true,
        customer: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }
}
