'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments, useCancelAppointment, Appointment } from '@/hooks/use-admin';

interface AppointmentsTableProps {
  tenantId: string;
}

export function AppointmentsTable({ tenantId }: AppointmentsTableProps) {
  const { data: appointments, isLoading, isError } = useAppointments(tenantId);
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (isError) {
    return <div>Error loading appointments.</div>;
  }

  const handleCancel = (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(appointmentId);
    }
  };

  return (
    <div className="rounded-md border">
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
          {appointments?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No appointments found.
              </TableCell>
            </TableRow>
          ) : (
            appointments?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {format(new Date(appointment.startTime), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell>{appointment.customer?.name || appointment.customerId}</TableCell>
                <TableCell>{appointment.service?.name || appointment.serviceId}</TableCell>
                <TableCell>{appointment.professional?.name || appointment.professionalId}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancel(appointment.id)}
                    disabled={appointment.status === 'CANCELED' || isCancelling}
                  >
                    Cancelar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
