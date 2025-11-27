import { useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
  Wrap,
  WrapItem,
  Spinner,
  Icon,
  Avatar,
  Stack,
  Textarea,
  Field,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Estilos base del calendario
import "./calendar-styles.css"; // Estilos personalizados
import { MdAccessTime, MdAttachMoney } from "react-icons/md";
import type { Service } from "../../types/index";
import { getServiceById } from "@/api/ServicesAPI";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigation,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createNewAppointment } from "@/api/AppointmentAPI";
import { getAvailableTimesForDate } from "@/api/AvailabilityAPI";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

export async function action({ params, request }: ActionFunctionArgs) {
  try {
    if (params.id === undefined) {
      throw new Error("ID del servicio no proporcionado");
    }
    const serviceId = +params.id;
    const formData = await request.formData();

    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const notes = formData.get("notes") as string;

    if (!date || !startTime) {
      toaster.create({
        title: "Error",
        description: "Debes seleccionar una fecha y horario",
        type: "error",
      });
      return null; // No redirigir, quedarse en la misma página
    }

    console.log("Datos de la cita a crear:", { date, startTime, notes });

    // Crear la cita
    await createNewAppointment(serviceId, {
      date,
      startTime,
      notes: notes || undefined,
    });

    toaster.create({
      title: "¡Cita Agendada!",
      description: "Tu cita ha sido agendada exitosamente.",
      type: "success",
      duration: 3000,
    });

    // Redirigir después de un breve momento para que el usuario vea el mensaje
    return redirect("/app/appointments");
  } catch (e: any) {
    console.error("Error al agendar cita:", e);
    const errorMsg =
      e?.response?.data?.error ??
      e?.response?.data?.message ??
      e?.message ??
      "No se pudo agendar la cita";

    toaster.create({
      title: "Error al agendar",
      description: errorMsg,
      type: "error",
      duration: 5000,
    });

    return null; // No redirigir en caso de error
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    if (!params.id) {
      throw new Error("ID del servicio no proporcionado");
    }

    const serviceId = +params.id;
    if (isNaN(serviceId)) {
      throw new Error("ID del servicio inválido");
    }

    console.log("Cargando servicio con ID:", serviceId);

    // Cargar el servicio (que incluye información del profesional)
    const service = await getServiceById(serviceId);

    if (!service) {
      throw new Error("Servicio no encontrado");
    }

    console.log("Servicio cargado:", service);

    return {
      service,
      // Inicializar con datos vacíos que se cargarán dinámicamente
      weeklyAvailability: [],
      availabilityExceptions: [],
    };
  } catch (error) {
    console.error("Error en loader de BookingView:", error);
    return redirect("/app/services");
  }
}

// Función para obtener horarios disponibles reales del profesional
const fetchAvailableTimes = async (
  professionalId: number,
  date: Date,
  token: string
): Promise<string[]> => {
  try {
    console.log("🔍 fetchAvailableTimes started");
    console.log("   Professional ID:", professionalId);
    console.log("   Date:", date.toDateString());
    console.log("   Token exists:", !!token);

    // Formatear fecha como YYYY-MM-DD usando la fecha local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;
    console.log("   Formatted date string:", dateString);

    console.log("🌐 Calling getAvailableTimesForDate API...");
    const availableTimes = await getAvailableTimesForDate(
      professionalId,
      dateString,
      token
    );

    console.log("📅 API Response - Horarios disponibles:", availableTimes);
    console.log("📊 Response type:", typeof availableTimes);
    console.log("📏 Response length:", availableTimes?.length || 0);

    return availableTimes || [];
  } catch (error: any) {
    console.error("💥 Error in fetchAvailableTimes:", error);
    console.error("📋 Error details:", {
      message: error?.message || "Unknown error",
      name: error?.name || "Unknown",
      stack: error?.stack || "No stack trace",
    });
    return []; // Devolver array vacío si hay error
  }
};

export default function BookingPage() {
  const service = useLoaderData().service as Service;
  const { token } = useAuthStore();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [notes, setNotes] = useState<string>("");

  const isSubmitting = navigation.state === "submitting";

  // Cargar horarios iniciales cuando el componente se monta
  useEffect(() => {
    console.log("useEffect triggered with:", {
      selectedDate: selectedDate.toDateString(),
      providerId: service?.provider?.id,
      token: !!token,
    });

    if (service?.provider?.id && token) {
      console.log("Loading initial times for:", selectedDate.toDateString());
      handleDateChange(selectedDate);
    }
  }, [service?.provider?.id, token]);

  // Debug: Log cuando cambia selectedDate
  useEffect(() => {
    console.log("Selected date changed to:", selectedDate.toDateString());
  }, [selectedDate]);

  // Función para manejar cambio de fecha en el calendario
  const handleDateChange = async (date: Date) => {
    console.log("*** handleDateChange called ***");
    console.log("Date received:", date);
    console.log("Date string:", date.toDateString());
    console.log("Service provider ID:", service?.provider?.id);
    console.log("Token exists:", !!token);
    console.log(
      "Token value:",
      token ? token.substring(0, 20) + "..." : "null"
    );

    if (service?.provider?.id && token) {
      console.log("✅ All requirements met, proceeding...");

      // Limpiar estado anterior
      setSelectedTime(null);
      setAvailableTimes([]);
      setIsLoadingTimes(true);

      console.log("🔄 Loading state set to true");

      try {
        console.log(
          " Fetching times for professional:",
          service.provider.id,
          "date:",
          date.toDateString()
        );
        const times = await fetchAvailableTimes(
          service.provider.id,
          date,
          token
        );
        console.log("Times received:", times);
        console.log("Number of available times:", times.length);
        setAvailableTimes(times);
        console.log("Available times state updated");
      } catch (error) {
        console.error("❌ Error al cargar horarios:", error);
        setAvailableTimes([]);
        toaster.create({
          title: "Error",
          description: "No se pudieron cargar los horarios disponibles",
          type: "error",
        });
      } finally {
        setIsLoadingTimes(false);
        console.log("🏁 Loading state set to false");
      }
    } else {
      console.log("❌ Missing requirements:", {
        providerId: service?.provider?.id,
        token: !!token,
      });
    }
  };
  if (!service) {
    return (
      <Box p={{ base: 4, md: 8 }}>
        <Heading as="h1">Servicio no encontrado</Heading>
        <Text>No pudimos encontrar los detalles del servicio solicitado.</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 8, md: 12 }}>
        {/* Columna Izquierda: Detalles del Servicio */}
        <VStack gap={4} align="stretch">
          <HStack mb="6" gap="3">
            <Avatar.Root size="2xl">
              <Avatar.Image src="https://bit.ly/dan-abramov" />
              <Avatar.Fallback name={service.provider.user.name} />
            </Avatar.Root>
            <Stack gap="0">
              <Text fontWeight="semibold" textStyle="sm">
                {service.provider.user.name}
              </Text>
              <Text
                color={useColorModeValue("fg.muted", "gray.400")}
                textStyle="sm"
              >
                {service.provider.specialty}
              </Text>
            </Stack>
          </HStack>

          <Badge colorScheme="purple" w="fit-content">
            {service.category.name}
          </Badge>
          <Heading as="h1" size="xl">
            {service.name}
          </Heading>
          <HStack gap={4} color={useColorModeValue("gray.600", "gray.400")}>
            <HStack>
              <Icon as={MdAccessTime} />
              <Text>{service.durationMin} min.</Text>
            </HStack>
            <HStack>
              <Icon as={MdAttachMoney} />
              <Text>${service.price} MXN</Text>
            </HStack>
          </HStack>
          <Text fontSize="lg" color={useColorModeValue("gray.700", "gray.300")}>
            {service.description}
          </Text>
        </VStack>

        {/* Columna Derecha: Calendario y Agendamiento */}
        <VStack
          gap={6}
          align="stretch"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
        >
          <Heading as="h2" size="lg">
            Agenda tu cita
          </Heading>
          <Box className="calendar-wrapper">
            <Calendar
              onChange={(value) => {
                console.log("*** Calendar onChange triggered ***");
                console.log("Value received:", value, "Type:", typeof value);

                if (value instanceof Date) {
                  console.log(" Valid date selected:", value.toDateString());
                  setSelectedDate(value);
                  handleDateChange(value);
                } else if (Array.isArray(value) && value[0] instanceof Date) {
                  console.log(
                    "✅ Valid date from array:",
                    value[0].toDateString()
                  );
                  setSelectedDate(value[0]);
                  handleDateChange(value[0]);
                } else {
                  console.log(" Invalid value received:", value);
                }
              }}
              value={selectedDate}
              minDate={new Date()}
              selectRange={false}
              showDoubleView={false}
              locale="es"
              next2Label={null}
              prev2Label={null}
              className="vitalna-calendar"
            />
          </Box>

          {isLoadingTimes && (
            <VStack gap={2}>
              <Spinner color="purple.500" />
              <Text>Cargando horarios disponibles...</Text>
            </VStack>
          )}

          {!isLoadingTimes && availableTimes.length > 0 && (
            <VStack align="stretch" gap={4}>
              <Text fontWeight="bold">Selecciona un horario:</Text>
              <Wrap gap={4}>
                {availableTimes.map((time) => (
                  <WrapItem key={time}>
                    <Button
                      colorScheme={selectedTime === time ? "purple" : "gray"}
                      variant={selectedTime === time ? "solid" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      _hover={{
                        bg: selectedTime === time ? "purple.600" : "gray.100",
                      }}
                    >
                      {time}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          )}

          {!isLoadingTimes && availableTimes.length === 0 && (
            <Box
              bg="red.50"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="red.200"
            >
              <Text color="red.600">
                ⚠️ No hay horarios disponibles para esta fecha
              </Text>
            </Box>
          )}

          {/* Campo de notas opcional */}
          {selectedTime && (
            <Field.Root>
              <Field.Label>Notas adicionales (opcional)</Field.Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Tengo alguna condición médica, necesito más información, etc."
                rows={3}
              />
              <Field.HelperText>
                Comparte información relevante para tu cita
              </Field.HelperText>
            </Field.Root>
          )}

          <Form method="post">
            {/* Campos ocultos con los datos de la cita */}
            <input
              type="hidden"
              name="date"
              value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`}
            />
            <input type="hidden" name="startTime" value={selectedTime || ""} />
            <input type="hidden" name="notes" value={notes} />

            <Button
              disabled={!selectedDate || !selectedTime || isSubmitting}
              loading={isSubmitting}
              width="100%"
              bg="brand.Cblue"
              color="white"
              type="submit"
              _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
              _disabled={{
                opacity: 0.5,
                cursor: "not-allowed",
                bg: "gray.400",
              }}
            >
              {isSubmitting
                ? "Agendando..."
                : selectedTime
                  ? "Agendar Cita"
                  : "Selecciona un horario para continuar"}
            </Button>
          </Form>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}
