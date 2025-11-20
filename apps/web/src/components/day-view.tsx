'use client';

import { Appointment } from '@/hooks/use-admin';
import { format, parseISO, getHours, getMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DayViewProps {
  appointments: Appointment[];
}

export function DayView({ appointments }: DayViewProps) {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  return (
    <div className="relative h-[800px] overflow-y-auto border rounded-md">
      {/* Time lines */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="relative h-[100px] border-b border-gray-200" // 100px height for each hour (50 minutes * 2px/min)
          style={{ top: `${(hour - 8) * 100}px` }}
        >
          <div className="absolute -left-16 top-[-10px] text-sm text-gray-500">
            {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
          </div>
        </div>
      ))}

      {/* Appointments */}
      {appointments.map((appointment) => {
        const startTime = parseISO(appointment.startTime);
        const startHour = getHours(startTime);
        const startMinute = getMinutes(startTime);

        // Calculate minutes from 8 AM
        const minutesSince8AM = (startHour - 8) * 60 + startMinute;

        // Calculate top position (2px per minute)
        const top = minutesSince8AM * 2;

        // Calculate height (durationMin * 2px per minute)
        const height = appointment.service.durationMin * 2;

        return (
          <div
            key={appointment.id}
            className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-80px)] bg-blue-100 border border-blue-300 rounded-md p-2 text-xs"
            style={{ top: `${top}px`, height: `${height}px` }}
          >
            <p className="font-semibold">{appointment.customer.name}</p>
            <p>{appointment.service.name}</p>
            <p className="text-gray-600">
              {format(startTime, 'HH:mm', { locale: ptBR })} -{' '}
              {format(parseISO(appointment.endTime), 'HH:mm', { locale: ptBR })}
            </p>
          </div>
        );
      })}
    </div>
  );
}