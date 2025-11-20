'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppointments, Appointment, useCancelAppointment } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';

interface AppointmentsTableProps {
  tenantId: string;
}

export function AppointmentsTable({ tenantId }: AppointmentsTableProps) {
  const { data: appointments, isLoading, isError } = useAppointments(tenantId);
  const cancelAppointmentMutation = useCancelAppointment();

  if (isLoading) {
    return <div>Carregando agendamentos...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar agendamentos.</div>;
  }

  const handleCancel = (appointmentId: string) => {
    cancelAppointmentMutation.mutate(appointmentId);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data/Hora</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Profissional</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments?.map((appointment: Appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              {format(new Date(appointment.startTime), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </TableCell>
            <TableCell>{appointment.customer?.name || 'N/A'}</TableCell>
            <TableCell>{appointment.service?.name || 'N/A'}</TableCell>
            <TableCell>{appointment.professional?.name || 'N/A'}</TableCell>
            <TableCell>{appointment.status}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancel(appointment.id)}
                disabled={
                  appointment.status === 'CANCELED' || cancelAppointmentMutation.isPending
                }
              >
                Cancelar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
