import {
  Box,
  Container,
  Stack,
  Text,
  Input,
  Textarea,
  Button,
  Grid,
  Card,
  Fieldset,
  Separator,
  Heading,
  Field,
  SegmentGroup,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { PasswordInput } from "@/components/ui/password-input";
import { Form, redirect, useLoaderData, useSubmit } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { getProfileData } from "@/api/AuthAPI";
import { updateProfile, changePassword } from "@/api/ProfileAPI";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

// Loader: obtiene los datos actuales del perfil
export async function loader() {
  const { token } = useAuthStore.getState();

  if (!token) {
    return redirect("/auth/login");
  }

  try {
    const profile = await getProfileData(token);
    return { profile };
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    return { profile: null };
  }
}

// Action: actualiza el perfil del usuario
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const { profile, logout } = useAuthStore.getState();

  const updates: any = {
    name: formData.get("name"),
    phone: formData.get("phone"),
  };

  // Campos específicos según el rol
  if (profile.role === "PROFESSIONAL") {
    updates.specialty = formData.get("specialty");
    updates.bio = formData.get("bio");
    const availableValue = formData.get("available");
    if (availableValue !== null) {
      updates.available = availableValue === "true";
    }
  } else if (profile.role === "CLIENT") {
    updates.birthDate = formData.get("birthDate");
    updates.gender = formData.get("gender");
  }

  try {
    await updateProfile(updates);

    toaster.create({
      title: "Perfil actualizado",
      description: "Cerrando sesión para aplicar cambios...",
      type: "success",
      duration: 2000,
    });

    // Cerrar sesión después de actualizar
    setTimeout(() => {
      logout();
      window.location.href = "/auth/login";
    }, 2000);

    return { success: true };
  } catch (error: any) {
    console.error("Error al actualizar el perfil:", error);

    toaster.create({
      title: "Error",
      description: error.message || "No se pudo actualizar el perfil",
      type: "error",
      duration: 5000,
    });

    return { success: false, error: error.message };
  }
}

export default function ProfileView() {
  const { profile } = useLoaderData() as { profile: any };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const submit = useSubmit();

  const bgColor = useColorModeValue("bg.canvas", "bg.canvas");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.300");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");

  const isProfessional = profile?.role === "PROFESSIONAL";

  const { control } = useForm({
    defaultValues: {
      available: profile?.available ? "true" : "false",
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "⚠️ Al guardar los cambios, tu sesión se cerrará automáticamente.\n\nDeberás iniciar sesión nuevamente para ver los cambios aplicados.\n\n¿Deseas continuar?"
    );

    if (confirmed) {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);
      submit(formData, { method: "post" });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Las contraseñas no coinciden",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Validar longitud mínima
    if (passwordData.newPassword.length < 8) {
      toaster.create({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toaster.create({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
        type: "success",
        duration: 3000,
      });

      // Limpiar el formulario
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toaster.create({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!profile) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="4xl">
          <Text color={textColor}>
            No se pudo cargar la información del perfil
          </Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="4xl" px={{ base: 4, sm: 6, md: 8 }}>
        {/* Encabezado con estilo mejorado */}
        <Stack
          gap={{ base: 3, md: 4 }}
          mb={{ base: 8, md: 10 }}
          textAlign={{ base: "center", md: "left" }}
        >
          <Heading
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="extrabold"
            color={headingColor}
            letterSpacing="tight"
          >
            Mi Perfil
          </Heading>
          <Text
            color={textColor}
            fontSize={{ base: "md", md: "lg" }}
            maxW="2xl"
          >
            Gestiona tu información personal y preferencias de cuenta
          </Text>
        </Stack>

        <Stack gap={6}>
          {/* Formulario Principal */}
          <Form method="post" onSubmit={handleSubmit}>
            <Card.Root
              bg={cardBg}
              borderColor={borderColor}
              shadow="lg"
              borderRadius="xl"
            >
              <Card.Body p={{ base: 5, md: 8 }}>
                <Stack gap={{ base: 8, md: 10 }}>
                  {/* Información Básica */}
                  <Box>
                    <Heading
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="bold"
                      color={headingColor}
                      mb={6}
                      pb={3}
                      borderBottom="2px solid"
                      borderColor={borderColor}
                    >
                      Información Básica
                    </Heading>

                    <Stack gap={6}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={6}
                      >
                        {/* Campo Nombre */}
                        <Box>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="semibold"
                            color={labelColor}
                            mb={2}
                          >
                            Nombre completo{" "}
                            <Text as="span" color="red.500" fontSize="lg">
                              *
                            </Text>
                          </Text>
                          <Input
                            name="name"
                            defaultValue={profile.name}
                            placeholder="Tu nombre completo"
                            size="lg"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: "brand.Cblue",
                              boxShadow: "0 0 0 1px #415380",
                            }}
                            required
                          />
                        </Box>

                        {/* Campo Teléfono */}
                        <Box>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="semibold"
                            color={labelColor}
                            mb={2}
                          >
                            Teléfono{" "}
                            <Text as="span" color="red.500" fontSize="lg">
                              *
                            </Text>
                          </Text>
                          <Input
                            name="phone"
                            type="tel"
                            defaultValue={profile.phone}
                            placeholder="Número de teléfono"
                            size="lg"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: "brand.Cblue",
                              boxShadow: "0 0 0 1px #415380",
                            }}
                            required
                          />
                        </Box>
                      </Grid>

                      {/* Campo Email */}
                      <Box>
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          fontWeight="semibold"
                          color={labelColor}
                          mb={2}
                        >
                          Correo electrónico
                        </Text>
                        <Input
                          type="email"
                          value={profile.email}
                          size="lg"
                          bg={inputBg}
                          borderRadius="lg"
                          disabled
                          opacity={0.5}
                          cursor="not-allowed"
                          _disabled={{
                            bg: useColorModeValue("gray.100", "gray.700"),
                          }}
                        />
                      </Box>

                      <Box
                        bg={useColorModeValue("#AEE5D1", "#415380")}
                        p={3}
                        borderRadius="md"
                        borderLeft="4px solid"
                        borderColor="brand.Cblue"
                      >
                        <Text
                          fontSize="xs"
                          color={useColorModeValue("brand.ink", "white")}
                          fontWeight="medium"
                        >
                          ℹ️ El correo electrónico no se puede modificar por
                          seguridad
                        </Text>
                      </Box>
                    </Stack>
                  </Box>

                  <Separator />

                  {/* Información Específica según Rol */}
                  {isProfessional ? (
                    <Box>
                      <Heading
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="bold"
                        color={headingColor}
                        mb={6}
                        pb={3}
                        borderBottom="2px solid"
                        borderColor={borderColor}
                      >
                        Información Profesional
                      </Heading>

                      <Stack gap={6}>
                        {/* Campo Especialidad */}
                        <Box>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="semibold"
                            color={labelColor}
                            mb={2}
                          >
                            Especialidad{" "}
                            <Text as="span" color="red.500" fontSize="lg">
                              *
                            </Text>
                          </Text>
                          <Input
                            name="specialty"
                            defaultValue={profile.specialty}
                            placeholder="Tu especialidad"
                            size="lg"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: "brand.Cblue",
                              boxShadow: "0 0 0 1px #415380",
                            }}
                            required
                          />
                        </Box>

                        {/* Campo Biografía */}
                        <Box>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="semibold"
                            color={labelColor}
                            mb={2}
                          >
                            Biografía
                          </Text>
                          <Text fontSize="xs" color={textColor} mb={3}>
                            Cuéntanos sobre tu experiencia y servicios
                          </Text>
                          <Textarea
                            name="bio"
                            defaultValue={profile.bio || ""}
                            placeholder="Describe tu experiencia profesional, especialidades y qué te hace único..."
                            rows={6}
                            resize="vertical"
                            size="lg"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: "brand.Cblue",
                              boxShadow: "0 0 0 1px #415380",
                            }}
                          />
                        </Box>

                        {/* Campo Disponible */}
                        <Controller
                          control={control}
                          name="available"
                          render={({ field }) => (
                            <Box>
                              <Text
                                fontSize={{ base: "sm", md: "md" }}
                                fontWeight="semibold"
                                color={labelColor}
                                mb={2}
                              >
                                Estado de disponibilidad
                              </Text>
                              <SegmentGroup.Root
                                size="lg"
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) =>
                                  field.onChange(value)
                                }
                              >
                                <SegmentGroup.Items
                                  items={[
                                    { label: "✓ Disponible", value: "true" },
                                    {
                                      label: "✗ No disponible",
                                      value: "false",
                                    },
                                  ]}
                                />
                                <SegmentGroup.Indicator />
                              </SegmentGroup.Root>
                              <Box
                                bg={useColorModeValue("#AEE5D1", "#415380")}
                                p={3}
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderColor="brand.Cblue"
                                mt={3}
                              >
                                <Text
                                  fontSize="xs"
                                  color={useColorModeValue(
                                    "brand.ink",
                                    "white"
                                  )}
                                  fontWeight="medium"
                                >
                                  💡 Indica si estás aceptando nuevos clientes.
                                  Los usuarios solo verán tus servicios si estás
                                  disponible.
                                </Text>
                              </Box>
                            </Box>
                          )}
                        />
                      </Stack>
                    </Box>
                  ) : (
                    <Box>
                      <Heading
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="bold"
                        color={headingColor}
                        mb={6}
                        pb={3}
                        borderBottom="2px solid"
                        borderColor={borderColor}
                      >
                        Información Personal
                      </Heading>

                      <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={6}
                      >
                        {/* Campo Fecha de Nacimiento */}
                        <Box>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="semibold"
                            color={labelColor}
                            mb={2}
                          >
                            Fecha de nacimiento
                          </Text>
                          <Input
                            name="birthDate"
                            type="date"
                            defaultValue={
                              profile.birthDate
                                ? new Date(profile.birthDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            size="lg"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: "brand.Cblue",
                              boxShadow: "0 0 0 1px #415380",
                            }}
                          />
                        </Box>

                        {/* Campo Género */}
                        <Box>
                          <Text
                            fontSize={{ base: "sm", md: "md" }}
                            fontWeight="semibold"
                            color={labelColor}
                            mb={2}
                          >
                            Género
                          </Text>
                          <Input
                            name="gender"
                            defaultValue={profile.gender}
                            placeholder="Género"
                            size="lg"
                            bg={inputBg}
                            borderRadius="lg"
                            _focus={{
                              borderColor: "brand.Cblue",
                              boxShadow: "0 0 0 1px #415380",
                            }}
                          />
                        </Box>
                      </Grid>
                    </Box>
                  )}

                  <Separator />

                  {/* Botones de Acción */}
                  <Stack
                    direction={{ base: "column-reverse", sm: "row" }}
                    gap={4}
                    justify="flex-end"
                    pt={2}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => window.location.reload()}
                      disabled={isSubmitting}
                      width={{ base: "full", sm: "auto" }}
                      minW={{ sm: "140px" }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      bg="brand.Cblue"
                      color="white"
                      size="lg"
                      loading={isSubmitting}
                      loadingText="Guardando..."
                      width={{ base: "full", sm: "auto" }}
                      minW={{ sm: "180px" }}
                      fontWeight="bold"
                      _hover={{ bg: "brand.ink" }}
                    >
                      Guardar Cambios
                    </Button>
                  </Stack>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Form>

          {/* Sección de Cambio de Contraseña */}
          <Card.Root
            bg={cardBg}
            borderColor={borderColor}
            shadow="lg"
            borderRadius="xl"
          >
            <Card.Body p={{ base: 5, md: 8 }}>
              <Box>
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  color={headingColor}
                  mb={6}
                  pb={3}
                  borderBottom="2px solid"
                  borderColor={borderColor}
                >
                  🔒 Cambiar Contraseña
                </Heading>

                <form onSubmit={handlePasswordChange}>
                  <Stack gap={6}>
                    {/* Contraseña Actual */}
                    <Box>
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight="semibold"
                        color={labelColor}
                        mb={2}
                      >
                        Contraseña actual{" "}
                        <Text as="span" color="red.500" fontSize="lg">
                          *
                        </Text>
                      </Text>
                      <PasswordInput
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Ingresa tu contraseña actual"
                        size="lg"
                        bg={inputBg}
                        borderRadius="lg"
                        required
                      />
                    </Box>

                    <Grid
                      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                      gap={6}
                    >
                      {/* Nueva Contraseña */}
                      <Box>
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          fontWeight="semibold"
                          color={labelColor}
                          mb={2}
                        >
                          Nueva contraseña{" "}
                          <Text as="span" color="red.500" fontSize="lg">
                            *
                          </Text>
                        </Text>
                        <PasswordInput
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="Mínimo 8 caracteres"
                          size="lg"
                          bg={inputBg}
                          borderRadius="lg"
                          required
                        />
                      </Box>

                      {/* Confirmar Contraseña */}
                      <Box>
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          fontWeight="semibold"
                          color={labelColor}
                          mb={2}
                        >
                          Confirmar contraseña{" "}
                          <Text as="span" color="red.500" fontSize="lg">
                            *
                          </Text>
                        </Text>
                        <PasswordInput
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Repite la nueva contraseña"
                          size="lg"
                          bg={inputBg}
                          borderRadius="lg"
                          required
                        />
                      </Box>
                    </Grid>

                    <Box
                      bg={useColorModeValue("#AEE5D1", "#415380")}
                      p={3}
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="brand.Cblue"
                    >
                      <Text
                        fontSize="xs"
                        color={useColorModeValue("brand.ink", "white")}
                        fontWeight="medium"
                      >
                        🔐 La contraseña debe tener al menos 8 caracteres. Una
                        vez actualizada, podrás usarla en tu próximo inicio de
                        sesión.
                      </Text>
                    </Box>

                    {/* Botón de Guardar Contraseña */}
                    <Stack
                      direction={{ base: "column-reverse", sm: "row" }}
                      gap={4}
                      justify="flex-end"
                      pt={2}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() =>
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          })
                        }
                        disabled={isChangingPassword}
                        width={{ base: "full", sm: "auto" }}
                        minW={{ sm: "140px" }}
                      >
                        Limpiar
                      </Button>
                      <Button
                        type="submit"
                        bg="brand.Cblue"
                        color="white"
                        size="lg"
                        loading={isChangingPassword}
                        loadingText="Cambiando..."
                        width={{ base: "full", sm: "auto" }}
                        minW={{ sm: "200px" }}
                        fontWeight="bold"
                        _hover={{ bg: "brand.ink" }}
                      >
                        Cambiar Contraseña
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Información de la cuenta con diseño mejorado */}
          <Card.Root
            bg={cardBg}
            borderColor={borderColor}
            shadow="md"
            borderRadius="xl"
          >
            <Card.Body p={{ base: 5, md: 6 }}>
              <Stack gap={4}>
                <Heading
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="bold"
                  color={headingColor}
                >
                  📋 Información de la Cuenta
                </Heading>
                <Grid
                  templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <Box
                    p={4}
                    bg={useColorModeValue("#F2F2F2", "gray.700/50")}
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderColor="brand.Cmint"
                  >
                    <Text
                      color={labelColor}
                      fontWeight="semibold"
                      fontSize="sm"
                      mb={2}
                    >
                      Rol
                    </Text>
                    <Text
                      color={headingColor}
                      fontWeight="bold"
                      fontSize={{ base: "lg", md: "xl" }}
                    >
                      {isProfessional ? "👨‍⚕️ Profesional" : "👤 Cliente"}
                    </Text>
                  </Box>
                  <Box
                    p={4}
                    bg={useColorModeValue("#F2F2F2", "gray.700/50")}
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderColor="brand.Cblue"
                  >
                    <Text
                      color={labelColor}
                      fontWeight="semibold"
                      fontSize="sm"
                      mb={2}
                    >
                      Miembro desde
                    </Text>
                    <Text
                      color={headingColor}
                      fontWeight="bold"
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      {new Date(profile.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Box>
                </Grid>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Container>
    </Box>
  );
}
