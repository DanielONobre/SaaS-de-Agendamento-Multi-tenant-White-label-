"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useServices, useProfessionals, useCreateAppointment } from "@/hooks/use-booking";
import { v4 as uuidv4 } from 'uuid'; // For placeholder TENANT_ID

// Placeholder TENANT_ID - REPLACE WITH ACTUAL TENANT ID FROM DB FOR TESTING
const TENANT_ID = "a1b2c3d4-e5f6-7890-1234-567890abcdef"; // Example UUID

const bookingFormSchema = z.object({
  professionalId: z.string().uuid({ message: "Please select a professional." }),
  serviceId: z.string().uuid({ message: "Please select a service." }),
  startTime: z.string().datetime({ message: "Please select a valid date and time." }),
  customerName: z.string().min(3, { message: "Customer name must be at least 3 characters." }),
});

export function BookingForm() {
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
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

  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    createAppointment(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="professionalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a professional" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingProfessionals ? (
                    <SelectItem value="loading" disabled>Loading professionals...</SelectItem>
                  ) : (
                    professionals?.map((professional) => (
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
              <FormLabel>Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingServices ? (
                    <SelectItem value="loading" disabled>Loading services...</SelectItem>
                  ) : (
                    services?.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - ${service.price.toFixed(2)}
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
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Scheduling..." : "Schedule Appointment"}
        </Button>
      </form>
    </Form>
  );
}