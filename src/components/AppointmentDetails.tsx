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
import { formatCurrency } from "@/utils";
import { FiCalendar, FiClock, FiUser, FiFileText } from "react-icons/fi";
import {
  Form,
  useNavigate,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";

type AppointmentDetailsProps = {
  appointment: Appointment;
  mode: "client" | "professional";
};

export async function cancelAppointmentAction({ params }: ActionFunctionArgs) {
  // TODO: Implementar lógica para cancelar cita
  if (params.id !== undefined) {
    // await cancelAppointment(+params.id);
    return redirect("/app/appointments");
  }
}

export default function AppointmentDetails({
  appointment,
  mode,
}: AppointmentDetailsProps) {
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
    <Box paddingY={"2"} maxW="6xl">
      <Card.Root
        rounded="2xl"
        overflow="hidden"
        borderWidth="1px"
        borderRadius="lg"
        flexDirection="row"
        transition="all 0.2s"
        _hover={{ transform: "scale(1.02)", shadow: "lg" }}
      >
        {/* Avatar/Icono */}
        <Box display="flex" alignItems="center" p={4}>
          <Avatar.Root size="lg" bg="brand.Cblue" color="white">
            <Avatar.Fallback>
              {mode === "client"
                ? appointment.professional?.user?.name?.charAt(0) || "P"
                : appointment.client?.user?.name?.charAt(0) || "C"}
            </Avatar.Fallback>
          </Avatar.Root>
        </Box>

        <Grid templateColumns="2fr 1fr" gap={4} p={4} flex="1">
          {/* Columna izquierda - Información principal */}
          <Box>
            <Card.Title fontWeight="semibold" mb={2}>
              {appointment.service?.name || "Servicio no disponible"}
            </Card.Title>

            <VStack align="start" gap={2} mb={3}>
              <HStack>
                <FiUser />
                <Text fontWeight="semibold">
                  {mode === "client"
                    ? `Profesional: ${appointment.professional?.user?.name || "N/A"}`
                    : `Cliente: ${appointment.client?.user?.name || "N/A"}`}
                </Text>
              </HStack>

              <HStack>
                <FiCalendar />
                <Text>{formattedDate}</Text>
              </HStack>

              <HStack>
                <FiClock />
                <Text>{formattedTime}</Text>
                <Badge variant="outline">{durationText}</Badge>
              </HStack>

              {appointment.notes && (
                <HStack align="start">
                  <FiFileText />
                  <Text fontSize="sm" color="gray.600">
                    {appointment.notes}
                  </Text>
                </HStack>
              )}
            </VStack>

            <HStack mt="3" gap={3}>
              <Badge colorScheme={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
              </Badge>
              {appointment.service?.price && (
                <Text fontWeight="bold" color="green.600">
                  {formatCurrency(appointment.service.price)}
                </Text>
              )}
            </HStack>
          </Box>

          {/* Columna derecha - Acciones */}
          <VStack align="stretch" gap={3} justify="center">
            {mode === "professional" ? (
              // Vista para profesional
              <>
                {appointment.status === "RESERVED" && (
                  <>
                    <Button
                      bg="green.500"
                      color="white"
                      _hover={{ bg: "green.600" }}
                    >
                      Marcar Completada
                    </Button>
                    <Button
                      bg="orange.500"
                      color="white"
                      _hover={{ bg: "orange.600" }}
                    >
                      Reprogramar
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/app/appointments/${appointment.id}/details`)
                  }
                >
                  Ver Detalles
                </Button>

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
                    >
                      Cancelar
                    </Button>
                  </Form>
                )}
              </>
            ) : (
              // Vista para cliente
              <>
                {appointment.status === "RESERVED" && (
                  <Button
                    bg="orange.500"
                    color="white"
                    _hover={{ bg: "orange.600" }}
                  >
                    Reprogramar
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/app/appointments/${appointment.id}/details`)
                  }
                >
                  Ver Detalles
                </Button>

                {appointment.status === "COMPLETED" && (
                  <Button
                    bg="brand.Cblue"
                    color="white"
                    _hover={{ bg: "brand.Cmint" }}
                  >
                    Calificar
                  </Button>
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
                    >
                      Cancelar
                    </Button>
                  </Form>
                )}
              </>
            )}
          </VStack>
        </Grid>
      </Card.Root>
    </Box>
  );
}
