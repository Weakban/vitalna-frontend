import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Card,
  Stack,
  Text,
  Button,
  Heading,
  Grid,
  Field,
  Flex,
  PinInput,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { useColorModeValue, ColorModeButton } from "@/components/ui/color-mode";
import { PasswordInput } from "@/components/ui/password-input";
import { validatePasswordResetToken, resetPassword } from "@/api/AuthAPI";
import { toaster } from "@/components/ui/toaster";
import Mesa from "../../assets/Mesa.jpg";

type ResetPasswordForm = {
  token: string[];
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordView() {
  const [isValidating, setIsValidating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.200");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const linkColor = useColorModeValue("brand.Cblue", "brand.Cmint");
  const inputBg = useColorModeValue("white", "gray.700");

  const password = watch("password");

  const handleValidateToken = async (token: string[]) => {
    setIsValidating(true);
    const tokenString = token.join("");
    try {
      await validatePasswordResetToken({ token: tokenString });
      setTokenValidated(true);
      toaster.create({
        title: "Código válido",
        description: "Ahora puedes establecer tu nueva contraseña",
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      toaster.create({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (formData: ResetPasswordForm) => {
    const tokenString = formData.token.join("");

    if (!tokenValidated) {
      await handleValidateToken(formData.token);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Las contraseñas no coinciden",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsResetting(true);
    try {
      const data = await resetPassword({
        token: tokenString,
        password: formData.password,
      });

      toaster.create({
        title: "Contraseña restablecida",
        description: data.message,
        type: "success",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error: any) {
      toaster.create({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Box
      bgImage={`url(${Mesa})`}
      bgPos="center"
      bgSize="cover"
      bgRepeat="no-repeat"
      minH="100dvh"
      display="grid"
      placeItems="center"
      px={{ base: 3, md: 4 }}
      py={{ base: 6, md: 12 }}
    >
      <Card.Root
        w="full"
        maxW={{ base: "95%", sm: "500px", md: "540px" }}
        shadow="2xl"
        rounded="3xl"
      >
        {/* Top Navigation */}
        <Flex
          justify="space-between"
          gap={{ base: 2, md: 4 }}
          px={{ base: 3, md: 4 }}
          pt={{ base: 3, md: 4 }}
          flexWrap="wrap"
        >
          <Button asChild size={{ base: "xs", md: "sm" }} variant="outline">
            <a href="/">Página principal</a>
          </Button>

          <ColorModeButton size={{ base: "xs", md: "sm" }} />

          <Button asChild size={{ base: "xs", md: "sm" }} variant="outline">
            <a href="/">Ayuda</a>
          </Button>
        </Flex>

        <Card.Header
          justifyContent="center"
          alignItems="center"
          px={{ base: 4, md: 6 }}
          pt={{ base: 4, md: 6 }}
          pb={{ base: 2, md: 4 }}
        >
          <Heading
            size={{ base: "md", md: "lg" }}
            color={headingColor}
            textAlign="center"
          >
            Restablecer contraseña
          </Heading>
          <Text
            mt={{ base: 1, md: 2 }}
            color={textColor}
            fontSize={{ base: "xs", md: "sm" }}
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            {!tokenValidated
              ? "Ingresa el código que recibiste por correo"
              : "Ahora crea tu nueva contraseña"}
          </Text>
        </Card.Header>

        <Card.Body px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={{ base: 4, md: 6 }}>
              {/* Token Field with PinInput */}
              <Box>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="semibold"
                  color={labelColor}
                  mb={{ base: 2, md: 3 }}
                  textAlign="center"
                >
                  Código de verificación
                </Text>
                <Field.Root invalid={!!errors.token}>
                  <Controller
                    control={control}
                    name="token"
                    rules={{
                      required: "El código es obligatorio",
                      validate: (value) =>
                        value?.length === 6 || "El código debe tener 6 dígitos",
                    }}
                    render={({ field }) => (
                      <Flex width="100%" justifyContent="center">
                        <PinInput.Root
                          mask
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                          disabled={tokenValidated}
                          size={{ base: "md", md: "lg" }}
                        >
                          <PinInput.HiddenInput />
                          <Flex
                            as={PinInput.Control}
                            width="100%"
                            maxW={{ base: "100%", sm: "380px", md: "420px" }}
                            gap={{ base: "2", sm: "3", md: "4" }}
                            justifyContent="space-between"
                          >
                            <PinInput.Input index={0} flex="1" minW="0" />
                            <PinInput.Input index={1} flex="1" minW="0" />
                            <PinInput.Input index={2} flex="1" minW="0" />
                            <PinInput.Input index={3} flex="1" minW="0" />
                            <PinInput.Input index={4} flex="1" minW="0" />
                            <PinInput.Input index={5} flex="1" minW="0" />
                          </Flex>
                        </PinInput.Root>
                      </Flex>
                    )}
                  />
                  <Field.ErrorText textAlign="center" mt={2}>
                    {errors.token?.message}
                  </Field.ErrorText>
                </Field.Root>
              </Box>

              {/* Password Fields - Solo se muestran cuando el token es válido */}
              {tokenValidated && (
                <Grid templateColumns="1fr" gap={{ base: 4, md: 6 }}>
                  <Box>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="semibold"
                      color={labelColor}
                      mb={2}
                    >
                      Nueva contraseña
                    </Text>
                    <PasswordInput
                      placeholder="Mínimo 8 caracteres"
                      size="lg"
                      bg={inputBg}
                      borderRadius="lg"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                          value: 8,
                          message: "Mínimo 8 caracteres",
                        },
                      })}
                    />
                    {errors.password && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.password.message}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="semibold"
                      color={labelColor}
                      mb={2}
                    >
                      Confirmar contraseña
                    </Text>
                    <PasswordInput
                      placeholder="Repite la contraseña"
                      size="lg"
                      bg={inputBg}
                      borderRadius="lg"
                      {...register("confirmPassword", {
                        required: "Confirma tu contraseña",
                        validate: (value) =>
                          value === password || "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.confirmPassword && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Info Box */}
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
                  {!tokenValidated
                    ? "El código es válido por 10 minutos"
                    : "Código validado. Establece tu nueva contraseña"}
                </Text>
              </Box>
            </Stack>
          </form>
        </Card.Body>

        <Separator />

        <Card.Footer
          flexDirection="column"
          gap={{ base: 3, md: 4 }}
          px={{ base: 4, md: 6 }}
          py={{ base: 4, md: 6 }}
        >
          <VStack gap={{ base: 2, md: 3 }} w="full">
            {/* Submit Button */}
            <Button
              type="submit"
              size={{ base: "md", md: "lg" }}
              w="full"
              bg="brand.Cblue"
              color="white"
              fontWeight="semibold"
              loading={isValidating || isResetting}
              loadingText={isValidating ? "Validando..." : "Restableciendo..."}
              _hover={{
                bg: "brand.Cmint",
                transform: "translateY(-1px)",
                shadow: "md",
              }}
              transition="all 0.2s"
              onClick={handleSubmit(onSubmit)}
            >
              {!tokenValidated ? "Validar código" : "Restablecer contraseña"}
            </Button>

            {/* Links */}
            <Box textAlign="center" w="full">
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={textColor}
                mb={2}
              >
                ¿No recibiste el código?
              </Text>
              <Button
                asChild
                size={{ base: "sm", md: "md" }}
                variant="outline"
                w="full"
                borderColor={linkColor}
                color={linkColor}
                _hover={{
                  bg: linkColor,
                  color: useColorModeValue("white", "brand.ink"),
                }}
              >
                <a href="/auth/forgot-password">Reenviar código</a>
              </Button>
            </Box>

            <Box textAlign="center" w="full" mt={2}>
              <Button
                asChild
                variant="plain"
                size={{ base: "sm", md: "md" }}
                color={linkColor}
                fontWeight="semibold"
                _hover={{ textDecoration: "underline" }}
              >
                <a href="/auth/login">← Volver al inicio de sesión</a>
              </Button>
            </Box>
          </VStack>
        </Card.Footer>
      </Card.Root>
    </Box>
  );
}
