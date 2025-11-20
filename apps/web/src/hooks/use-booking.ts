import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = "http://localhost:3000"; // Assuming API runs on port 3000

// Hook to fetch services for a given tenant
export function useServices(tenantId: string) {
  return useQuery({
    queryKey: ["services", tenantId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/services?tenantId=${tenantId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      return response.json();
    },
    enabled: !!tenantId, // Only run the query if tenantId is available
  });
}

// Hook to fetch professionals for a given tenant
export function useProfessionals(tenantId: string) {
  return useQuery({
    queryKey: ["professionals", tenantId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/professionals?tenantId=${tenantId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch professionals");
      }
      return response.json();
    },
    enabled: !!tenantId, // Only run the query if tenantId is available
  });
}

interface CreateAppointmentPayload {
  professionalId: string;
  serviceId: string;
  startTime: string; // ISO string
  customerName: string;
  tenantId: string;
  customerId: string; // Assuming a customerId is needed, will generate a random one for now
}

// Hook to create an appointment
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAppointment: CreateAppointmentPayload) => {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        // Attempt to parse error message from response body
        let errorMessage = "Failed to create appointment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(`${response.status} ${errorMessage}`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Agendamento criado!",
        description: "Seu agendamento foi realizado com sucesso.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] }); // Invalidate appointments query to refetch
    },
    onError: (error: any) => {
      if (error.message.includes("409")) { // Check for 409 status code in the error message
        toast({
          title: "Horário Indisponível",
          description: "Esse horário já está ocupado. Tente outro.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao agendar",
          description: error.message || "Ocorreu um erro ao tentar agendar.",
          variant: "destructive",
        });
      }
    },
  });
}
