import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = "http://localhost:3000";

// Define AppointmentStatus enum (assuming it matches backend)
export type AppointmentStatus = 'CONFIRMED' | 'CANCELED' | 'PENDING'; // Add other statuses if needed

// Define Appointment type (adjust based on actual API response)
export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  tenantId: string;
  professionalId: string;
  serviceId: string;
  customerId: string;
  // Include nested objects if they are returned by the API
  professional?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
  };
  customer?: {
    id: string;
    name: string;
  };
}

// Hook to fetch appointments for a given tenant
export function useAppointments(tenantId: string) {
  return useQuery<Appointment[]>({
    queryKey: ["appointments", tenantId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/appointments?tenantId=${tenantId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      return response.json();
    },
    enabled: !!tenantId, // Only run the query if tenantId is available
  });
}

// Hook to cancel an appointment
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to cancel appointment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(`${response.status} ${errorMessage}`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Agendamento cancelado!",
        description: "O agendamento foi cancelado com sucesso.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] }); // Invalidate appointments query to refetch
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cancelar agendamento",
        description: error.message || "Ocorreu um erro ao tentar cancelar o agendamento.",
        variant: "destructive",
      });
    },
  });
}
