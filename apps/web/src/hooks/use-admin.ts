import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

const API_BASE_URL = '/api';

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

const mutationFetcher = async <T>(url: string, method: string, data?: any): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

const professionalSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  tenantId: z.string().uuid(),
});

const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  durationMin: z.number(), // in minutes
  tenantId: z.string().uuid(),
});

// Assuming a simple customer structure for now, based on common use cases
const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const appointmentSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.enum(['CONFIRMED', 'CANCELED', 'COMPLETED']), // Assuming these statuses
  professionalId: z.string().uuid(),
  professional: professionalSchema, // Included from backend
  service: serviceSchema, // Included from backend
  customer: customerSchema, // Included from backend
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const useAppointments = (
  tenantId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments', tenantId, startDate, endDate],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }
      return fetcher<Appointment[]>(`${API_BASE_URL}/appointments?${params.toString()}`);
    },
    enabled: !!tenantId,
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<Appointment, Error, string>({
    mutationFn: (id: string) =>
      mutationFetcher<Appointment>(`${API_BASE_URL}/appointments/${id}/cancel`, 'PATCH'),
    onSuccess: () => {
      toast({
        title: 'Agendamento cancelado!',
        description: 'O agendamento foi cancelado com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao cancelar agendamento',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
