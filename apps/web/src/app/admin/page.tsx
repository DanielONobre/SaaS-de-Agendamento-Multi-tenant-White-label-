'use client';

import React, { useState } from 'react';
import { format, addDays, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button'; // Assuming Button is available
import { DayView } from '@/components/day-view'; // Import the DayView component
import { useAppointments } from '@/hooks/use-admin'; // Import useAppointments

const AdminPage = () => {
  const TENANT_ID = 'c1a2b3c4-d5e6-7890-1234-567890abcdef'; // Hardcoded TENANT_ID for now
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedStartDate = format(startOfDay(currentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  const formattedEndDate = format(endOfDay(currentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

  const { data: appointments, isLoading, isError } = useAppointments(
    TENANT_ID,
    formattedStartDate,
    formattedEndDate
  );

  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex items-center justify-between mb-4">
        <Button onClick={handlePreviousDay}>Dia Anterior</Button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'PPP', { locale: ptBR })}
        </h2>
        <Button onClick={handleNextDay}>Próximo Dia</Button>
      </div>

      {isLoading && <div>Loading appointments for {format(currentDate, 'PPP')}...</div>}
      {isError && <div>Error loading appointments.</div>}
      {appointments && <DayView appointments={appointments} currentDate={currentDate} />}
    </div>
  );
};

export default AdminPage;
