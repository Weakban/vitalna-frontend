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
//action function to cancel appointment

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
        <Container
          maxW="6xl"
          py={{ base: 4, md: 6, lg: 10 }}
          px={{ base: 4, md: 6 }}
        >
          {/* Encabezado */}
          <Stack gap={{ base: 1, md: 2 }} mb={{ base: 4, md: 6 }}>
            <Text
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              color={headingColor}
            >
              {title}
            </Text>
            <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
              {description}
            </Text>
          </Stack>

          {/* Tabs para organizar las citas */}
          <Tabs.Root defaultValue="upcoming" variant="enclosed">
            <Tabs.List
              mb={{ base: 3, md: 4 }}
              flexWrap="wrap"
              gap={{ base: 1, md: 2 }}
            >
              <Tabs.Trigger
                value="upcoming"
                fontSize={{ base: "xs", md: "sm" }}
                px={{ base: 2, md: 4 }}
                py={{ base: 1, md: 2 }}
              >
                Próximas ({upcomingAppointments.length})
              </Tabs.Trigger>
              <Tabs.Trigger
                value="completed"
                fontSize={{ base: "xs", md: "sm" }}
                px={{ base: 2, md: 4 }}
                py={{ base: 1, md: 2 }}
              >
                Completadas ({completedAppointments.length})
              </Tabs.Trigger>
              <Tabs.Trigger
                value="cancelled"
                fontSize={{ base: "xs", md: "sm" }}
                px={{ base: 2, md: 4 }}
                py={{ base: 1, md: 2 }}
              >
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
                <Box
                  textAlign="center"
                  py={{ base: 6, md: 8 }}
                  px={{ base: 4, md: 0 }}
                >
                  <Text
                    fontStyle="italic"
                    color={mutedColor}
                    fontSize={{ base: "sm", md: "md" }}
                  >
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
                <Box
                  textAlign="center"
                  py={{ base: 6, md: 8 }}
                  px={{ base: 4, md: 0 }}
                >
                  <Text
                    fontStyle="italic"
                    color={mutedColor}
                    fontSize={{ base: "sm", md: "md" }}
                  >
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
                <Box
                  textAlign="center"
                  py={{ base: 6, md: 8 }}
                  px={{ base: 4, md: 0 }}
                >
                  <Text
                    fontStyle="italic"
                    color={mutedColor}
                    fontSize={{ base: "sm", md: "md" }}
                  >
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
