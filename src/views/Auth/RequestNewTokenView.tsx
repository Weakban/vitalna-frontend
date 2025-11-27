import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Text,
  Separator,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { Form, useFetcher, type ActionFunctionArgs } from "react-router-dom";
import Mesa from "../../assets/Mesa.jpg";
import {
  emailOnlySchema,
  type emailOnlyForm,
  type NewTokenData,
} from "@/types";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { newToken } from "@/api/AuthAPI";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { useColorModeValue, ColorModeButton } from "@/components/ui/color-mode";

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData()); // todo string
  console.log(formData);
  try {
    //llamamos a api
    //El promise espera una promesa la cual es la respuesta de nuestra api
    toaster.promise(newToken(formData), {
      loading: {
        title: "Creando tu cuenta...",
        description: "Un momento por favor",
      },
      success: (data) => ({
        title: "Código enviado",
        description: data,
      }),
      error: (error: any) => ({
        title: "Algo salio mal",
        description: error.message,
      }),
    });
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? "No se pudo crear la cuenta";
    return msg;
  }
  return;
}

export default function RequestNewTokenView() {
  const fetcher = useFetcher();
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.200");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const linkColor = useColorModeValue("brand.Cblue", "brand.Cmint");
  const inputBg = useColorModeValue("white", "gray.700");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<emailOnlyForm>({
    resolver: zodResolver(emailOnlySchema),
  });

  const handleForm = async (formData: NewTokenData) => {
    fetcher.submit(formData, { method: "post" });
    reset();
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
            Solicitar nuevo código
          </Heading>
          <Text
            mt={{ base: 1, md: 2 }}
            color={textColor}
            fontSize={{ base: "xs", md: "sm" }}
            textAlign="center"
            px={{ base: 2, md: 0 }}
          >
            Ingresa tu correo electrónico para recibir un nuevo código de
            confirmación
          </Text>
        </Card.Header>

        <Form onSubmit={handleSubmit(handleForm)} noValidate>
          <Card.Body px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
            <Stack gap={{ base: 4, md: 6 }}>
              <Field.Root invalid={!!errors.email}>
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="semibold"
                  color={labelColor}
                  mb={2}
                >
                  Correo electrónico
                </Text>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@gmail.com"
                  size="lg"
                  bg={inputBg}
                  borderRadius="lg"
                  _focus={{
                    borderColor: "brand.Cblue",
                    boxShadow: "0 0 0 1px #415380",
                  }}
                  {...register("email", {
                    required: "El correo electrónico es obligatorio",
                  })}
                />
                <Field.ErrorText fontSize="sm" mt={1}>
                  {errors.email?.message}
                </Field.ErrorText>
              </Field.Root>

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
                  Recibirás un código de 6 dígitos válido por 8 minutos
                </Text>
              </Box>
            </Stack>
          </Card.Body>

          <Separator />

          <Card.Footer
            flexDirection="column"
            gap={{ base: 3, md: 4 }}
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
          >
            <VStack gap={{ base: 2, md: 3 }} w="full">
              <Button
                type="submit"
                size={{ base: "md", md: "lg" }}
                w="full"
                bg="brand.Cblue"
                color="white"
                fontWeight="semibold"
                _hover={{
                  bg: "brand.Cmint",
                  transform: "translateY(-1px)",
                  shadow: "md",
                }}
                transition="all 0.2s"
              >
                Solicitar código
              </Button>

              <Box textAlign="center" w="full">
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={textColor}
                  mb={2}
                >
                  ¿Ya tienes un código?
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
                  <a href="/auth/confirm-account">Confirmar cuenta</a>
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
        </Form>
      </Card.Root>
    </Box>
  );
}
