import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  Stack,
  Text,
  Input,
  Button,
  Heading,
  Flex,
  Separator,
  VStack,
} from "@chakra-ui/react";
import { useColorModeValue, ColorModeButton } from "@/components/ui/color-mode";
import { forgotPassword } from "@/api/AuthAPI";
import { toaster } from "@/components/ui/toaster";
import Mesa from "../../assets/Mesa.jpg";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.200");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const linkColor = useColorModeValue("brand.Cblue", "brand.Cmint");
  const inputBg = useColorModeValue("white", "gray.700");

  const onSubmit = async (formData: ForgotPasswordForm) => {
    setIsSubmitting(true);
    try {
      const data = await forgotPassword(formData);
      toaster.create({
        title: "Código enviado",
        description: data.message,
        type: "success",
        duration: 5000,
      });
    } catch (error: any) {
      toaster.create({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
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
            ¿Olvidaste tu contraseña?
          </Heading>
          <Text
            mt={{ base: 1, md: 2 }}
            color={textColor}
            fontSize={{ base: "xs", md: "sm" }}
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            Ingresa tu correo electrónico y te enviaremos un código
          </Text>
        </Card.Header>

        <Card.Body px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={{ base: 4, md: 6 }}>
              {/* Email Field */}
              <Box>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="semibold"
                  color={labelColor}
                  mb={2}
                >
                  Correo electrónico
                </Text>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  size="lg"
                  bg={inputBg}
                  borderRadius="lg"
                  _focus={{
                    borderColor: "brand.Cblue",
                    boxShadow: "0 0 0 1px #415380",
                  }}
                  {...register("email", {
                    required: "El correo electrónico es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico no válido",
                    },
                  })}
                />
                {errors.email && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.email.message}
                  </Text>
                )}
              </Box>

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
                  📧 Recibirás un código de 6 dígitos válido por 10 minutos
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
              loading={isSubmitting}
              loadingText="Enviando..."
              _hover={{
                bg: "brand.Cmint",
                transform: "translateY(-1px)",
                shadow: "md",
              }}
              transition="all 0.2s"
              onClick={handleSubmit(onSubmit)}
            >
              Enviar código
            </Button>

            {/* Links */}
            <Box textAlign="center" w="full">
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={textColor}
                mb={2}
              >
                ¿Ya tienes el código?
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
                <a href="/auth/reset-password">Restablecer contraseña</a>
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
