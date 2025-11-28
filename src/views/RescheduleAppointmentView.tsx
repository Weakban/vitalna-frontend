import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useNavigate,
  useLocation,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import { rescheduleAppointment } from "@/api/AppointmentAPI";
import { getAvailableTimesForDate } from "@/api/AvailabilityAPI";
import { useAuthStore } from "@/store/auth";
import type { Appointment } from "@/types";
import { formatCurrency } from "@/utils";
import { FiCalendar, FiClock } from "react-icons/fi";

export async function action({ request, params }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData());

  if (params.id !== undefined) {
    try {
      await rescheduleAppointment(+params.id, {
        date: data.date as string,
        startTime: data.startTime as string,
      });
      return redirect("/app/appointments");
    } catch (error: any) {
      return { error: error.message || "Error al reprogramar la cita" };
    }
  }
}

export default function RescheduleAppointmentView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuthStore();

  // Obtenemos la cita del state de navegación
  const appointment = location.state?.appointment as Appointment | undefined;
  const mode = location.state?.mode as "client" | "professional" | undefined;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Debug: verificar qué datos tenemos
  console.log("Appointment:", appointment);
  console.log("Mode:", mode);
  console.log("ServiceId:", appointment?.serviceId);
  console.log("Service:", appointment?.service);

  if (!appointment || !mode) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="xl" color="red.500" mb={4}>
          No se encontró información de la cita
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Debug Info:
        </Text>
        <Text fontSize="xs" color="gray.400" mb={1}>
          Appointment: {appointment ? "✓ Presente" : "✗ No encontrado"}
        </Text>
        <Text fontSize="xs" color="gray.400" mb={1}>
          Mode: {mode ? `✓ ${mode}` : "✗ No encontrado"}
        </Text>
        <Text fontSize="xs" color="gray.400" mb={4}>
          Location State: {JSON.stringify(location.state, null, 2)}
        </Text>
        <Button mt={4} onClick={() => navigate("/app/appointments")}>
          Volver a mis citas
        </Button>
      </Box>
    );
  }

  const handleDateChange = async (newDate: string) => {
    setSelectedDate(newDate);
    setSelectedTime(""); // Reset time when date changes

    // Obtener el professionalId del appointment
    const professionalId = appointment.professionalId;

    console.log("HandleDateChange - newDate:", newDate);
    console.log("HandleDateChange - professionalId:", professionalId);
    console.log("HandleDateChange - token:", token ? "Present" : "Missing");

    if (newDate && professionalId && token) {
      setIsLoadingSlots(true);
      try {
        console.log(
          "Fetching slots for professionalId:",
          professionalId,
          "date:",
          newDate
        );
        const slots = await getAvailableTimesForDate(
          professionalId,
          newDate,
          token
        );
        console.log("Slots received:", slots);
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Error al cargar horarios:", error);
        setAvailableSlots([]);
        toaster.error({
          title: "Error",
          description: "No se pudieron cargar los horarios disponibles",
        });
      } finally {
        setIsLoadingSlots(false);
      }
    } else {
      console.log(
        "No se puede cargar horarios - falta newDate, professionalId o token"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toaster.error({
        title: "Datos incompletos",
        description: "Por favor selecciona una fecha y hora",
      });
      return;
    }

    setIsLoading(true);
    try {
      await rescheduleAppointment(appointment.id, {
        date: selectedDate,
        startTime: selectedTime,
      });

      toaster.success({
        title: "Cita reprogramada",
        description: "La cita ha sido reprogramada exitosamente",
      });

      navigate("/app/appointments");
    } catch (error: any) {
      toaster.error({
        title: "Error",
        description: error.message || "No se pudo reprogramar la cita",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      RESERVED: "Reservada",
      COMPLETED: "Completada",
      CANCELED: "Cancelada",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      RESERVED: "blue",
      COMPLETED: "green",
      CANCELED: "red",
    };
    return colorMap[status] || "gray";
  };

  // Obtener datos del cliente
  const client = appointment.client?.user;

  return (
    <Box maxW="4xl" mx="auto" p={{ base: 4, md: 8 }}>
      <VStack align="stretch" gap={6}>
        {/* Encabezado */}
        <Box>
          <Button
            variant="ghost"
            onClick={() => navigate("/app/appointments")}
            mb={4}
            size={{ base: "sm", md: "md" }}
          >
            ← Volver a mis citas
          </Button>
          <Heading size={{ base: "lg", md: "xl" }}>Reprogramar Cita</Heading>
        </Box>

        {/* Información de la cita actual */}
        <Card.Root>
          <Card.Header>
            <Card.Title fontSize={{ base: "md", md: "lg" }}>
              Información de la Cita Actual
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={3}>
              {/* Servicio */}
              <HStack>
                <FiCalendar color="gray" />
                <Box>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.500"
                    fontWeight="medium"
                  >
                    Servicio
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">
                    {appointment.service?.name}
                  </Text>
                </Box>
              </HStack>

              {/* Fecha y hora actual */}
              <HStack>
                <FiClock color="gray" />
                <Box>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.500"
                    fontWeight="medium"
                  >
                    Fecha y Hora Actual
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }}>
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Text>
                </Box>
              </HStack>

              {/* Cliente */}
              {mode === "professional" && client && (
                <HStack>
                  <Box>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.500"
                      fontWeight="medium"
                    >
                      Cliente
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {client.name}
                    </Text>
                  </Box>
                </HStack>
              )}

              {/* Precio y Estado */}
              <HStack justify="space-between">
                {appointment.service?.price && (
                  <Text
                    fontWeight="bold"
                    color="green.600"
                    fontSize={{ base: "lg", md: "xl" }}
                  >
                    {formatCurrency(appointment.service.price)}
                  </Text>
                )}
                <Badge
                  colorScheme={getStatusColor(appointment.status)}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {getStatusText(appointment.status)}
                </Badge>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Formulario de reagendamiento */}
        <Card.Root>
          <Card.Header>
            <Card.Title fontSize={{ base: "md", md: "lg" }}>
              Selecciona Nueva Fecha y Hora
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <VStack align="stretch" gap={6}>
                {/* Selector de fecha */}
                <Field.Root>
                  <Field.Label fontSize={{ base: "sm", md: "md" }}>
                    Nueva Fecha
                  </Field.Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    size={{ base: "md", md: "lg" }}
                  />
                  <Field.HelperText fontSize={{ base: "xs", md: "sm" }}>
                    Selecciona una fecha para ver los horarios disponibles
                  </Field.HelperText>
                </Field.Root>

                {/* Selector de hora */}
                <Field.Root>
                  <Field.Label fontSize={{ base: "sm", md: "md" }}>
                    Nueva Hora
                  </Field.Label>
                  {isLoadingSlots ? (
                    <Box p={4} textAlign="center">
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.500"
                      >
                        Cargando horarios disponibles...
                      </Text>
                    </Box>
                  ) : selectedDate && availableSlots.length > 0 ? (
                    <Box
                      display="grid"
                      gridTemplateColumns={{
                        base: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)",
                        lg: "repeat(5, 1fr)",
                      }}
                      gap={2}
                    >
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          variant={selectedTime === slot ? "solid" : "outline"}
                          colorPalette={selectedTime === slot ? "blue" : "gray"}
                          size={{ base: "sm", md: "md" }}
                          type="button"
                        >
                          {slot}
                        </Button>
                      ))}
                    </Box>
                  ) : selectedDate ? (
                    <Box
                      p={4}
                      bg="orange.50"
                      borderRadius="md"
                      textAlign="center"
                    >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color="orange.700"
                      >
                        No hay horarios disponibles para esta fecha
                      </Text>
                    </Box>
                  ) : (
                    <Box
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      textAlign="center"
                    >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.500"
                      >
                        Selecciona una fecha primero
                      </Text>
                    </Box>
                  )}
                </Field.Root>

                {/* Botones de acción */}
                <HStack justify="flex-end" gap={3} pt={4}>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/app/appointments")}
                    size={{ base: "sm", md: "md" }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    bg="orange.500"
                    color="white"
                    _hover={{ bg: "orange.600" }}
                    loading={isLoading}
                    loadingText="Reprogramando..."
                    disabled={!selectedDate || !selectedTime}
                    size={{ base: "sm", md: "md" }}
                  >
                    Confirmar Reprogramación
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}
