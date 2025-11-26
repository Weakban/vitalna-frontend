import {
  getClientAppointments,
  getProfessionalAppointments,
} from "@/api/AppointmentAPI";
import AppointmentDetails from "@/components/AppointmentDetails";
import type { Appointment } from "@/types";

import { Box, Container, Stack, Text, Tabs } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useColorModeValue } from "@/components/ui/color-mode";

export async function loader() {
  const { profile } = useAuthStore.getState();

  try {
    if (profile.role === "CLIENT") {
      const appointments = await getClientAppointments();
      return { appointments, mode: "client" as const };
    } else if (profile.role === "PROFESSIONAL") {
      const appointments = await getProfessionalAppointments(
        profile.professionalId
      );
      return { appointments, mode: "professional" as const };
    }
  } catch (error) {
    console.error("Error al cargar las citas:", error);
    return { appointments: [], mode: "client" as const };
  }

  return { appointments: [], mode: "client" as const };
}

export default function AppointmentsView() {
  const { appointments, mode } = useLoaderData() as {
    appointments: Appointment[];
    mode: "client" | "professional";
  };

  const bgColor = useColorModeValue("bg.canvas", "bg.canvas");
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.300");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  const title = mode === "client" ? "Mis Citas" : "Citas de Pacientes";
  const description =
    mode === "client"
      ? "Administra tus citas programadas."
      : "Gestiona las citas de tus pacientes.";

  // Filtrar citas por estado para mejor organización
  const upcomingAppointments =
    appointments?.filter(
      (app) => app.status === "RESERVED" || app.status === "INTERESTED"
    ) || [];

  const completedAppointments =
    appointments?.filter((app) => app.status === "COMPLETED") || [];

  const cancelledAppointments =
    appointments?.filter((app) => app.status === "CANCELLED") || [];

  return (
    <>
      <Box bg={bgColor} minH="100vh">
        <Container maxW="6xl" py={{ base: 6, md: 10 }}>
          {/* Encabezado */}
          <Stack gap={2} mb={6}>
            <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
              {title}
            </Text>
            <Text color={textColor}>{description}</Text>
          </Stack>

          {/* Tabs para organizar las citas */}
          <Tabs.Root defaultValue="upcoming" variant="enclosed">
            <Tabs.List mb={4}>
              <Tabs.Trigger value="upcoming">
                Próximas ({upcomingAppointments.length})
              </Tabs.Trigger>
              <Tabs.Trigger value="completed">
                Completadas ({completedAppointments.length})
              </Tabs.Trigger>
              <Tabs.Trigger value="cancelled">
                Canceladas ({cancelledAppointments.length})
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="upcoming">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentDetails
                    key={appointment.id}
                    appointment={appointment}
                    mode={mode}
                  />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text fontStyle="italic" color={mutedColor}>
                    {mode === "client"
                      ? "No tienes citas próximas programadas."
                      : "No hay citas próximas de pacientes."}
                  </Text>
                </Box>
              )}
            </Tabs.Content>

            <Tabs.Content value="completed">
              {completedAppointments.length > 0 ? (
                completedAppointments.map((appointment) => (
                  <AppointmentDetails
                    key={appointment.id}
                    appointment={appointment}
                    mode={mode}
                  />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text fontStyle="italic" color={mutedColor}>
                    {mode === "client"
                      ? "No tienes historial de citas completadas."
                      : "No hay historial de citas completadas."}
                  </Text>
                </Box>
              )}
            </Tabs.Content>

            <Tabs.Content value="cancelled">
              {cancelledAppointments.length > 0 ? (
                cancelledAppointments.map((appointment) => (
                  <AppointmentDetails
                    key={appointment.id}
                    appointment={appointment}
                    mode={mode}
                  />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text fontStyle="italic" color={mutedColor}>
                    No hay citas canceladas.
                  </Text>
                </Box>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </Container>
      </Box>
    </>
  );
}
