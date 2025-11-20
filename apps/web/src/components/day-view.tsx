'use client';

import React from 'react';
import { format, parseISO, getHours, getMinutes, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/hooks/use-admin'; // Assuming Appointment type is exported

interface DayViewProps {
  appointments: Appointment[];
  currentDate: Date;
}

export function DayView({ appointments, currentDate }: DayViewProps) {
  const startHour = 8; // Start displaying from 8 AM
  const endHour = 20; // End displaying at 8 PM
  const minutesPerPixel = 2; // 2px per minute

  // Generate time slots for display
  const timeSlots = [];
  for (let i = startHour; i <= endHour; i++) {
    timeSlots.push(format(new Date().setHours(i, 0, 0, 0), 'HH:mm'));
  }

  return (
    <div className="relative h-[800px] overflow-y-auto border rounded-md p-2">
      {/* Time lines */}
      {timeSlots.map((time, index) => (
        <div
          key={time}
          className="relative border-b border-gray-200"
          style={{ height: index < timeSlots.length - 1 ? `${60 * minutesPerPixel}px` : '0px' }} // 60 minutes * 2px/min
        >
          <span className="absolute -left-16 top-[-10px] text-xs text-gray-500">
            {time}
          </span>
        </div>
      ))}

      {/* Appointments */}
      {appointments.map((appointment) => {
        const startTime = parseISO(appointment.startTime);
        const serviceDuration = appointment.service?.durationMin || 60; // Default to 60 minutes if not available

        const appointmentHour = getHours(startTime);
        const appointmentMinute = getMinutes(startTime);

        // Calculate minutes from 8 AM
        const minutesSinceStartHour = (appointmentHour - startHour) * 60 + appointmentMinute;

        // Calculate top position (2px per minute)
        const topPosition = minutesSinceStartHour * minutesPerPixel;

        // Calculate height (2px per minute of service duration)
        const height = serviceDuration * minutesPerPixel;

        // Ensure appointment is within the displayed day
        if (format(startTime, 'yyyy-MM-dd') !== format(currentDate, 'yyyy-MM-dd')) {
          return null;
        }

        return (
          <div
            key={appointment.id}
            className="absolute left-1/4 w-3/4 bg-blue-100 border border-blue-300 rounded-md p-1 text-xs overflow-hidden"
            style={{
              top: `${topPosition}px`,
              height: `${height}px`,
            }}
          >
            <p className="font-bold">{appointment.customer?.name || 'Cliente'}</p>
            <p>{appointment.service?.name || 'Serviço'}</p>
            <p className="text-gray-600">
              {format(startTime, 'HH:mm', { locale: ptBR })} -{' '}
              {format(addMinutes(startTime, serviceDuration), 'HH:mm', { locale: ptBR })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
