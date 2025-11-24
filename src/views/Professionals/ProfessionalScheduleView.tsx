// src/views/Professional/ProfessionalScheduleView.tsx

import React, { useState } from "react";
import {
  useLoaderData,
  useFetcher,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Heading,
  Tabs,
  VStack,
  HStack,
  Text,
  Switch,
  Input,
  IconButton,
  Button,
  SimpleGrid,
  RadioGroup,
  Stack,
  Field,
} from "@chakra-ui/react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toaster } from "@/components/ui/toaster";
import {
  getWeeklySchedule,
  updateWeeklySchedule,
  getExceptions,
  addException,
  deleteException,
} from "@/api/AvailabilityAPI";
import type { ExceptionDate, TimeBlock, WeeklyDaySchedule } from "@/types";
import { useAuthStore } from "@/store/auth";

// Tipos para los formularios
interface ExceptionFormData {
  date: string;
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
}

// Tipos para el loader
interface ScheduleLoaderData {
  weeklySchedule: WeeklyDaySchedule[];
  exceptions: ExceptionDate[];
}

// Loader: carga los datos iniciales
export async function loader(): Promise<ScheduleLoaderData> {
  // Obtener el token desde localStorage, cookies, o donde lo tengas guardado
  const token = useAuthStore.getState().token;

  if (!token) {
    throw redirect("/auth/login");
  }

  try {
    const [scheduleApiData, exceptionsApiData] = await Promise.all([
      getWeeklySchedule(token),
      getExceptions(token),
    ]);

    // Lógica de transformación de datos del backend al formato de UI
    const initialWeeklySchedule: WeeklyDaySchedule[] = [
      { dayOfWeek: 0, dayName: "Domingo", isAvailable: false, blocks: [] },
      { dayOfWeek: 1, dayName: "Lunes", isAvailable: false, blocks: [] },
      { dayOfWeek: 2, dayName: "Martes", isAvailable: false, blocks: [] },
      { dayOfWeek: 3, dayName: "Miércoles", isAvailable: false, blocks: [] },
      { dayOfWeek: 4, dayName: "Jueves", isAvailable: false, blocks: [] },
      { dayOfWeek: 5, dayName: "Viernes", isAvailable: false, blocks: [] },
      { dayOfWeek: 6, dayName: "Sábado", isAvailable: false, blocks: [] },
    ];

    const newScheduleState = initialWeeklySchedule.map((dayState) => ({
      ...dayState,
      blocks: [] as TimeBlock[],
    }));

    // Mapea los datos de la API al estado de UI
    for (const dbBlock of scheduleApiData) {
      const dayInState = newScheduleState.find(
        (d) => d.dayOfWeek === dbBlock.dayOfWeek
      );

      if (dayInState) {
        dayInState.isAvailable = true;
        dayInState.blocks.push({
          id: dbBlock.id,
          startTime: dbBlock.startTime,
          endTime: dbBlock.endTime,
        });
      }
    }

    return {
      weeklySchedule: newScheduleState,
      exceptions: exceptionsApiData,
    };
  } catch (error) {
    throw new Response("Error al cargar la disponibilidad", { status: 500 });
  }
}

// Action: maneja todas las operaciones de escritura
export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const token = useAuthStore.getState().token;

  if (!token) {
    throw redirect("/auth/login");
  }

  try {
    switch (formData.actionType) {
      case "saveWeeklySchedule": {
        const scheduleData = JSON.parse(formData.scheduleData as string);
        const dataToSave = scheduleData.filter(
          (day: WeeklyDaySchedule) => day.isAvailable
        );

        toaster.promise(updateWeeklySchedule(token, dataToSave), {
          loading: {
            title: "Guardando horario...",
            description: "Un momento por favor",
          },
          success: {
            title: "Horario guardado exitosamente",
            description: "Tu horario semanal ha sido actualizado",
          },
          error: (error: any) => ({
            title: "Error al guardar horario",
            description: error?.message || "No se pudo guardar el horario",
          }),
        });
        break;
      }

      case "addException": {
        // Asegurar que la fecha se mantenga como fecha local
        const dateStr = formData.date as string;
        const localDate = new Date(dateStr + "T12:00:00"); // Añadir hora del mediodía local

        const exceptionData = {
          date: localDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
          isAvailable: formData.isAvailable === "true",
          startTime: (formData.startTime as string) || undefined,
          endTime: (formData.endTime as string) || undefined,
        };

        toaster.promise(addException(token, exceptionData), {
          loading: {
            title: "Añadiendo excepción...",
            description: "Un momento por favor",
          },
          success: {
            title: "Excepción añadida exitosamente",
            description: "La excepción ha sido creada correctamente",
          },
          error: (error: any) => ({
            title: "Error al añadir excepción",
            description: error?.message || "No se pudo añadir la excepción",
          }),
        });
        break;
      }

      case "deleteException": {
        const exceptionId = parseInt(formData.exceptionId as string);

        toaster.promise(deleteException(token, exceptionId), {
          loading: {
            title: "Eliminando excepción...",
            description: "Un momento por favor",
          },
          success: {
            title: "Excepción eliminada exitosamente",
            description: "La excepción ha sido eliminada correctamente",
          },
          error: (error: any) => ({
            title: "Error al eliminar excepción",
            description: error?.message || "No se pudo eliminar la excepción",
          }),
        });
        break;
      }

      default:
        throw new Error("Acción no válida");
    }
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ?? error?.message ?? "Operación fallida";
    return { error: msg };
  }

  return { success: true };
}

export default function ProfessionalScheduleView() {
  // Obtener datos del loader
  const {
    weeklySchedule: initialWeeklySchedule,
    exceptions: initialExceptions,
  } = useLoaderData() as ScheduleLoaderData;

  // Fetchers para manejar formularios sin navegación
  const weeklyScheduleFetcher = useFetcher();
  const exceptionFetcher = useFetcher();
  const deleteExceptionFetcher = useFetcher();

  // --- Estado para el Horario Semanal (inicializado con datos del loader) ---
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyDaySchedule[]>(
    initialWeeklySchedule
  );

  // --- Estado para las Excepciones (inicializado con datos del loader) ---
  const [exceptions] = useState<ExceptionDate[]>(initialExceptions);

  // React Hook Form para excepciones
  const exceptionForm = useForm<ExceptionFormData>({
    defaultValues: {
      date: "",
      isAvailable: false,
      startTime: "09:00",
      endTime: "17:00",
    },
  });

  // Recargar datos cuando las operaciones sean exitosas
  React.useEffect(() => {
    if (
      exceptionFetcher.data?.success ||
      deleteExceptionFetcher.data?.success
    ) {
      window.location.reload();
    }
  }, [exceptionFetcher.data, deleteExceptionFetcher.data]);

  // --- Handlers para el Horario Semanal ---
  const handleDayToggle = (dayIndex: number, isChecked: boolean) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].isAvailable = isChecked;
    // Si se habilita y no hay bloques, añade uno por defecto
    if (isChecked && updatedSchedule[dayIndex].blocks.length === 0) {
      updatedSchedule[dayIndex].blocks = [
        { startTime: "09:00", endTime: "17:00" },
      ];
    }
    // Si se deshabilita, borra los bloques
    if (!isChecked) {
      updatedSchedule[dayIndex].blocks = [];
    }
    setWeeklySchedule(updatedSchedule);
  };

  const handleSaveWeeklySchedule = () => {
    const formData = new FormData();
    formData.append("actionType", "saveWeeklySchedule");
    formData.append(
      "scheduleData",
      JSON.stringify(weeklySchedule.filter((day) => day.isAvailable))
    );
    weeklyScheduleFetcher.submit(formData, { method: "post" });
  };

  const handleBlockChange = (
    dayIndex: number,
    blockIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].blocks[blockIndex][field] = value;
    setWeeklySchedule(updatedSchedule);
  };

  const handleAddBlock = (dayIndex: number) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].blocks.push({
      startTime: "09:00",
      endTime: "10:00",
    });
    setWeeklySchedule(updatedSchedule);
  };

  const handleDeleteBlock = (dayIndex: number, blockIndex: number) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].blocks.splice(blockIndex, 1);
    setWeeklySchedule(updatedSchedule);
  };

  const onSubmitException = (data: ExceptionFormData) => {
    const formData = new FormData();
    formData.append("actionType", "addException");
    formData.append("date", data.date);
    formData.append("isAvailable", data.isAvailable.toString());
    if (data.isAvailable && data.startTime && data.endTime) {
      formData.append("startTime", data.startTime);
      formData.append("endTime", data.endTime);
    }
    exceptionFetcher.submit(formData, { method: "post" });
  };

  const handleDeleteException = (exceptionId: number) => {
    const formData = new FormData();
    formData.append("actionType", "deleteException");
    formData.append("exceptionId", exceptionId.toString());
    deleteExceptionFetcher.submit(formData, { method: "post" });
  };

  // --- INICIO DEL BLOQUE JSX ---
  return (
    <Box p={{ base: 4, md: 8 }}>
      <Heading as="h1" size="xl" mb={6}>
        Gestionar mi Disponibilidad
      </Heading>

      <Tabs.Root defaultValue="weekly" variant="outline" colorScheme="purple">
        <Tabs.List mb={4}>
          <Tabs.Trigger value="weekly">Horario Semanal</Tabs.Trigger>
          <Tabs.Trigger value="exceptions">Excepciones</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Indicator />

        {/* --- PANEL 1: HORARIO SEMANAL --- */}
        <Tabs.Content value="weekly">
          <VStack gap={6} align="stretch">
            {weeklySchedule.map((day, dayIndex) => (
              <Box
                key={day.dayOfWeek}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="white"
              >
                <HStack justifyContent="space-between" mb={4}>
                  <Heading size="md">{day.dayName}</Heading>
                  <HStack>
                    <Text>
                      {day.isAvailable ? "Disponible" : "No disponible"}
                    </Text>

                    <Switch.Root
                      checked={day.isAvailable}
                      onCheckedChange={(details) =>
                        handleDayToggle(dayIndex, details.checked)
                      }
                      colorPalette="purple"
                    >
                      <Switch.HiddenInput />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </HStack>
                </HStack>

                {day.isAvailable && (
                  <VStack gap={4} align="stretch">
                    {day.blocks.map((block, blockIndex) => (
                      <HStack key={blockIndex} gap={4}>
                        <Input
                          type="time"
                          value={block.startTime}
                          onChange={(e) =>
                            handleBlockChange(
                              dayIndex,
                              blockIndex,
                              "startTime",
                              e.target.value
                            )
                          }
                        />
                        <Text>-</Text>
                        <Input
                          type="time"
                          value={block.endTime}
                          onChange={(e) =>
                            handleBlockChange(
                              dayIndex,
                              blockIndex,
                              "endTime",
                              e.target.value
                            )
                          }
                        />
                        <IconButton
                          aria-label="Eliminar bloque"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteBlock(dayIndex, blockIndex)
                          }
                        >
                          <FaTrash />
                        </IconButton>
                      </HStack>
                    ))}
                    <Button
                      size="sm"
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => handleAddBlock(dayIndex)}
                    >
                      <FaPlus />
                      Añadir bloque
                    </Button>
                  </VStack>
                )}
              </Box>
            ))}
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleSaveWeeklySchedule}
              loading={weeklyScheduleFetcher.state === "submitting"}
            >
              Guardar Horario Semanal
            </Button>
          </VStack>
        </Tabs.Content>

        {/* --- PANEL 2: EXCEPCIONES --- */}
        <Tabs.Content value="exceptions">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            {/* Formulario para añadir excepciones */}
            <form onSubmit={exceptionForm.handleSubmit(onSubmitException)}>
              <VStack
                gap={4}
                p={6}
                borderWidth="1px"
                borderRadius="md"
                bg="white"
                align="stretch"
              >
                <Heading size="md">Añadir Excepción</Heading>
                <Field.Root>
                  <Field.Label>Fecha</Field.Label>
                  <Controller
                    name="date"
                    control={exceptionForm.control}
                    rules={{ required: "La fecha es obligatoria" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                      />
                    )}
                  />
                  <Field.HelperText color="red.500">
                    {exceptionForm.formState.errors.date?.message}
                  </Field.HelperText>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Tipo de Excepción</Field.Label>
                  <Controller
                    name="isAvailable"
                    control={exceptionForm.control}
                    render={({ field }) => (
                      <RadioGroup.Root
                        value={field.value ? "available" : "blocked"}
                        onValueChange={(details) =>
                          field.onChange(details.value === "available")
                        }
                      >
                        <Stack direction="row" gap={4}>
                          <RadioGroup.Item value="blocked">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              Día Bloqueado (No disponible)
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>

                          <RadioGroup.Item value="available">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              Horario Especial (Disponible)
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                        </Stack>
                      </RadioGroup.Root>
                    )}
                  />
                </Field.Root>{" "}
                {exceptionForm.watch("isAvailable") && (
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>Hora Inicio</Field.Label>
                      <Controller
                        name="startTime"
                        control={exceptionForm.control}
                        render={({ field }) => <Input {...field} type="time" />}
                      />
                    </Field.Root>
                    <Text alignSelf="end" pb={2}>
                      -
                    </Text>
                    <Field.Root>
                      <Field.Label>Hora Fin</Field.Label>
                      <Controller
                        name="endTime"
                        control={exceptionForm.control}
                        render={({ field }) => <Input {...field} type="time" />}
                      />
                    </Field.Root>
                  </HStack>
                )}
                <Button
                  colorScheme="purple"
                  type="submit"
                  loading={exceptionFetcher.state === "submitting"}
                >
                  Añadir Excepción
                </Button>
              </VStack>
            </form>

            {/* Lista de excepciones existentes */}
            <VStack gap={4} align="stretch">
              <Heading size="md">Mis Excepciones</Heading>
              {exceptions.length === 0 && (
                <Text color="gray.500">No tienes excepciones programadas.</Text>
              )}
              {exceptions.map((ex) => (
                <HStack
                  key={ex.id}
                  p={4}
                  bg="white"
                  borderWidth="1px"
                  borderRadius="md"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontWeight="bold">
                      {(() => {
                        try {
                          // Asegurar que ex.date sea una fecha válida
                          const dateStr = ex.date;
                          if (!dateStr) return "Fecha no válida";

                          // Crear fecha de manera local para evitar problemas de zona horaria
                          let date;
                          if (dateStr.includes("T")) {
                            // Si incluye hora (como 2025-11-15T00:00:00.000Z), extraer solo la fecha
                            const datePart = dateStr.split("T")[0]; // "2025-11-15"
                            const [year, month, day] = datePart
                              .split("-")
                              .map(Number);
                            date = new Date(year, month - 1, day); // Crear como fecha local
                          } else {
                            // Para fechas sin hora, parsear manualmente para evitar UTC
                            const [year, month, day] = dateStr
                              .split("-")
                              .map(Number);
                            date = new Date(year, month - 1, day); // month es 0-indexado
                          }

                          if (isNaN(date.getTime())) return "Fecha no válida";

                          // Formatear con locale español
                          return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", {
                            locale: es,
                          });
                        } catch (error) {
                          console.error(
                            "Error formatting date:",
                            error,
                            ex.date
                          );
                          return "Fecha no válida";
                        }
                      })()}
                    </Text>
                    {ex.isAvailable ? (
                      <Text color="green.500">
                        Disponible: {ex.startTime} - {ex.endTime}
                      </Text>
                    ) : (
                      <Text color="red.500">Día No Disponible</Text>
                    )}
                  </Box>
                  <IconButton
                    aria-label="Eliminar excepción"
                    colorScheme="red"
                    variant="ghost"
                    loading={deleteExceptionFetcher.state === "submitting"}
                    onClick={() => handleDeleteException(ex.id!)}
                  >
                    <FaTrash />
                  </IconButton>
                </HStack>
              ))}
            </VStack>
          </SimpleGrid>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
