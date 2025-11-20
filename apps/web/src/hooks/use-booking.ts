import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';

// Define API base URL (adjust if needed)
const API_BASE_URL = '/api'; // Assuming Next.js API routes or proxy

// Generic fetcher function
const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Schemas for data types
const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  duration: z.number(), // in minutes
  tenantId: z.string().uuid(),
});

const professionalSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  tenantId: z.string().uuid(),
});

const createAppointmentSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  startTime: z.string().datetime(), // ISO string
  customerName: z.string().min(3, 'Customer name must be at least 3 characters'),
});

export type Service = z.infer<typeof serviceSchema>;
export type Professional = z.infer<typeof professionalSchema>;
export type CreateAppointmentPayload = z.infer<typeof createAppointmentSchema>;

// Hook to fetch services
export const useServices = (tenantId: string) => {
  return useQuery<Service[], Error>({
    queryKey: ['services', tenantId],
    queryFn: () => fetcher<Service[]>(`${API_BASE_URL}/services?tenantId=${tenantId}`),
    enabled: !!tenantId, // Only run if tenantId is available
  });
};

// Hook to fetch professionals
export const useProfessionals = (tenantId: string) => {
  return useQuery<Professional[], Error>({
    queryKey: ['professionals', tenantId],
    queryFn: () => fetcher<Professional[]>(`${API_BASE_URL}/professionals?tenantId=${tenantId}`),
    enabled: !!tenantId, // Only run if tenantId is available
  });
};

// Hook to create an appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, CreateAppointmentPayload>({
    mutationFn: async (newAppointment) => {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error('Horário Indisponível');
        }
        throw new Error(errorData.message || 'Erro ao agendar');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Agendamento realizado!',
        description: 'Seu agendamento foi criado com sucesso.',
      });
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro no agendamento',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};