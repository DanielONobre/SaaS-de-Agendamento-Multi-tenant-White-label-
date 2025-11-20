'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { addDays, subDays, format, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { DayView } from '@/components/day-view';
import { useAppointments } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';

const queryClient = new QueryClient();

const TENANT_ID = 'clsy0427j0000131000000000'; // Hardcoded for now

export default function AdminPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedStartDate = format(startOfDay(currentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  const formattedEndDate = format(endOfDay(currentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const { data: appointments, isLoading, isError } = useAppointments(
    TENANT_ID,
    formattedStartDate,
    formattedEndDate,
  );

  const handlePreviousDay = () => {
    setCurrentDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => addDays(prev, 1));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex items-center justify-between mb-6">
          <Button onClick={handlePreviousDay} variant="outline">
            Dia Anterior
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'PPP', { locale: ptBR })}
          </h2>
          <Button onClick={handleNextDay} variant="outline">
            Próximo Dia
          </Button>
        </div>

        {isLoading && <div>Carregando agendamentos...</div>}
        {isError && <div>Erro ao carregar agendamentos.</div>}
        {appointments && <DayView appointments={appointments} />}
      </div>
    </QueryClientProvider>
  );
}
