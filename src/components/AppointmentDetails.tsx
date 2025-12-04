import type { Appointment } from "@/types";
import {
  Button,
  Card,
  HStack,
  Text,
  Box,
  Badge,
  VStack,
  Grid,
  Avatar,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { formatCurrency } from "@/utils";
import { FiCalendar, FiClock, FiUser, FiFileText } from "react-icons/fi";
import {
  Form,
  redirect,
  useNavigate,
  type ActionFunctionArgs,
} from "react-router-dom";
import { cancelAppointment, completeAppointment } from "@/api/AppointmentAPI";

type AppointmentDetailsProps = {
  appointment: Appointment;
  mode: "client" | "professional";
};

export async function cancelAppointmentAction({ params }: ActionFunctionArgs) {
  // TODO: Implementar lógica para cancelar cita
  if (params.id !== undefined) {
    await cancelAppointment(+params.id);
    return redirect("/app/appointments");
  }
}

export async function completeAppointmentAction({
  params,
}: ActionFunctionArgs) {
  // TODO: Implementar lógica para cancelar cita
  if (params.id !== undefined) {
    await completeAppointment(+params.id);
    return redirect("/app/appointments");
  }
}

export default function AppointmentDetails({
  appointment,
  mode,
}: AppointmentDetailsProps) {
  const iconColor = useColorModeValue("gray.700", "gray.300");
  const navigate = useNavigate();

  // Formatear fecha y hora
  const appointmentDate = new Date(appointment.appointmentDate);
  const formattedDate = appointmentDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Formatear duración
  const durationText =
    appointment.duration >= 60
      ? `${Math.floor(appointment.duration / 60)}h ${appointment.duration % 60}min`
      : `${appointment.duration} min`;

  // Determinar color del status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESERVED":
        return "blue";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      case "INTERESTED":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "RESERVED":
        return "Reservada";
      case "COMPLETED":
        return "Completada";
      case "CANCELLED":
        return "Cancelada";
      case "INTERESTED":
        return "Interesado";
      default:
        return status;
    }
  };

  return (
    <Box paddingY={{ base: "2", md: "3" }} maxW="6xl">
      <Card.Root
        rounded="2xl"
        overflow="hidden"
        borderWidth="1px"
        borderRadius="lg"
        flexDirection={{ base: "column", md: "row" }}
        transition="all 0.2s"
        _hover={{ transform: "scale(1.02)", shadow: "lg" }}
      >
        {/* Avatar/Icono */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ base: "center", md: "flex-start" }}
          p={{ base: 3, md: 4 }}
        >
          <Avatar.Root
            size={{ base: "md", md: "lg" }}
            bg="brand.Cblue"
            color="white"
          >
            <Avatar.Fallback>
              {mode === "client"
                ? appointment.professional?.user?.name?.charAt(0) || "P"
                : appointment.client?.user?.name?.charAt(0) || "C"}
            </Avatar.Fallback>
          </Avatar.Root>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
          gap={{ base: 3, md: 4 }}
          p={{ base: 3, md: 4 }}
          flex="1"
        >
          {/* Columna izquierda - Información principal */}
          <Box>
            <Card.Title
              fontWeight="semibold"
              mb={{ base: 2, md: 3 }}
              fontSize={{ base: "md", md: "lg" }}
            >
              {appointment.service?.name || "Servicio no disponible"}
            </Card.Title>

            <VStack
              align="start"
              gap={{ base: 1.5, md: 2 }}
              mb={{ base: 2, md: 3 }}
            >
              <HStack color={iconColor} fontSize={{ base: "sm", md: "md" }}>
                <FiUser />
                <Text fontWeight="semibold">
                  {mode === "client"
                    ? `Profesional: ${appointment.professional?.user?.name || "N/A"}`
                    : `Cliente: ${appointment.client?.user?.name || "N/A"}`}
                </Text>
              </HStack>

              <HStack color={iconColor} fontSize={{ base: "sm", md: "md" }}>
                <FiCalendar />
                <Text>{formattedDate}</Text>
              </HStack>

              <HStack
                color={iconColor}
                fontSize={{ base: "sm", md: "md" }}
                flexWrap="wrap"
              >
                <HStack>
                  <FiClock />
                  <Text>{formattedTime}</Text>
                </HStack>
                <Badge variant="outline" fontSize={{ base: "xs", md: "sm" }}>
                  {durationText}
                </Badge>
              </HStack>

              {appointment.notes && (
                <HStack
                  align="start"
                  color={iconColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  <FiFileText />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color={useColorModeValue("gray.600", "gray.400")}
                  >
                    {appointment.notes}
                  </Text>
                </HStack>
              )}
            </VStack>

            <HStack
              mt={{ base: 2, md: 3 }}
              gap={{ base: 2, md: 3 }}
              flexWrap="wrap"
            >
              <Badge
                colorScheme={getStatusColor(appointment.status)}
                fontSize={{ base: "xs", md: "sm" }}
              >
                {getStatusText(appointment.status)}
              </Badge>
              {appointment.service?.price && (
                <Text
                  fontWeight="bold"
                  color="green.600"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {formatCurrency(appointment.service.price)}
                </Text>
              )}
            </HStack>
          </Box>

          {/* Columna derecha - Acciones */}
          <VStack align="stretch" gap={{ base: 2, md: 3 }} justify="center">
            {mode === "professional" ? (
              // Vista para profesional
              <>
                {appointment.status === "RESERVED" && (
                  <>
                    <Form
                      method="post"
                      action={`/app/appointments/${appointment.id}/complete`}
                      onSubmit={(e) => {
                        if (
                          !confirm("¿Quieres marcar esta cita como completada?")
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Button
                        width="100%"
                        bg="green.500"
                        type="submit"
                        color="white"
                        _hover={{ bg: "green.600" }}
                        size={{ base: "sm", md: "md" }}
                      >
                        Marcar Completada
                      </Button>
                    </Form>

                    <Button
                      width="100%"
                      bg="orange.500"
                      color="white"
                      _hover={{ bg: "orange.600" }}
                      size={{ base: "sm", md: "md" }}
                      onClick={() =>
                        navigate(
                          `/app/appointments/${appointment.id}/reschedule`,
                          {
                            state: { appointment, mode },
                          }
                        )
                      }
                    >
                      Reprogramar
                    </Button>
                  </>
                )}

                {appointment.status === "RESERVED" && (
                  <Form
                    method="post"
                    action={`/app/appointments/${appointment.id}/cancel`}
                    onSubmit={(e) => {
                      if (!confirm("¿Estás seguro de cancelar esta cita?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Button
                      width="100%"
                      bg="red.500"
                      color="white"
                      type="submit"
                      _hover={{ bg: "red.600" }}
                      size={{ base: "sm", md: "md" }}
                    >
                      Cancelar
                    </Button>
                  </Form>
                )}
              </>
            ) : (
              // Vista para cliente
              <>
                {/*appointment.status === "COMPLETED" && (
                  <Button
                    bg="brand.Cblue"
                    color="white"
                    _hover={{ bg: "brand.Cmint" }}
                    size={{ base: "sm", md: "md" }}
                  >
                    Calificar
                  </Button>
                )*/}

                {appointment.status === "RESERVED" && (
                  <>
                    <Button
                      width="100%"
                      bg="orange.500"
                      color="white"
                      _hover={{ bg: "orange.600" }}
                      size={{ base: "sm", md: "md" }}
                      onClick={() =>
                        navigate(
                          `/app/appointments/${appointment.id}/reschedule`,
                          {
                            state: { appointment, mode },
                          }
                        )
                      }
                    >
                      Reprogramar
                    </Button>

                    <Form
                      method="post"
                      action={`/app/appointments/${appointment.id}/cancel`}
                      onSubmit={(e) => {
                        if (!confirm("¿Estás seguro de cancelar esta cita?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Button
                        width="100%"
                        bg="red.500"
                        color="white"
                        type="submit"
                        _hover={{ bg: "red.600" }}
                        size={{ base: "sm", md: "md" }}
                      >
                        Cancelar
                      </Button>
                    </Form>
                  </>
                )}
              </>
            )}
          </VStack>
        </Grid>
      </Card.Root>
    </Box>
  );
}
