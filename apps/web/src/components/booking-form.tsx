"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid'; // For generating a temporary customerId

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfessionals, useServices, useCreateAppointment } from "@/hooks/use-booking";

// Placeholder TENANT_ID - REPLACE WITH A VALID TENANT ID FROM YOUR DATABASE
const TENANT_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Example UUID

const formSchema = z.object({
  professionalId: z.string().uuid({ message: "Selecione um profissional válido." }),
  serviceId: z.string().uuid({ message: "Selecione um serviço válido." }),
  startTime: z.string().min(1, { message: "A data e hora são obrigatórias." }),
  customerName: z.string().min(3, { message: "O nome do cliente deve ter pelo menos 3 caracteres." }),
});

export function BookingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      professionalId: "",
      serviceId: "",
      startTime: "",
      customerName: "",
    },
  });

  const { data: services, isLoading: isLoadingServices } = useServices(TENANT_ID);
  const { data: professionals, isLoading: isLoadingProfessionals } = useProfessionals(TENANT_ID);
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Generate a temporary customerId for now
    const customerId = uuidv4();

    createAppointment({
      ...values,
      tenantId: TENANT_ID,
      customerId: customerId,
    });
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Agendar Horário</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="professionalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissional</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingProfessionals ? (
                      <SelectItem value="loading" disabled>Carregando profissionais...</SelectItem>
                    ) : (
                      professionals?.map((professional: any) => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviço</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingServices ? (
                      <SelectItem value="loading" disabled>Carregando serviços...</SelectItem>
                    ) : (
                      services?.map((service: any) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e Hora</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Agendando..." : "Agendar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
