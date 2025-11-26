import {
  Box,
  Text,
  Card,
  Button,
  Heading,
  Field,
  Flex,
} from "@chakra-ui/react";
import { Form, useFetcher, type ActionFunctionArgs } from "react-router-dom";

import { Controller, useForm } from "react-hook-form";

import Mesa from "../../assets/Mesa.jpg";
import { toaster } from "@/components/ui/toaster";
import { confirmAccount } from "@/api/AuthAPI";
import { PinInput } from "@chakra-ui/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useColorModeValue, ColorModeButton } from "@/components/ui/color-mode";

const formSchema = z.object({
  token: z
    .array(z.string().min(1), { error: "Pin is required" })
    .length(6, { message: "Pin must be 4 digits long" }),
});
type FormValues = z.infer<typeof formSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData()); // todo string
  console.log(formData);

  // const token = Object.keys(formData)[0];
  // console.log(token);

  try {
    toaster.promise(confirmAccount(formData), {
      loading: {
        title: "Confirmando tu cuenta...",
        description: "Un momento por favor",
      },
      success: (data) => ({
        title: "Cuenta confirmada, ya puedes cerrar esta ventana",
        description: data,
      }),
      error: (error: any) => ({
        title: "Error",
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

export default function ConfirmAccountView() {
  const fetcher = useFetcher();
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.200");

  const { handleSubmit, control, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit((data) => {
    const token = data;

    console.log(token);
    fetcher.submit(token, {
      method: "post",
      action: "/auth/confirm-account",
    });
  });

  const handleComplete = () => {
    onSubmit();
  };

  return (
    <>
      <Box
        bgImage={`url(${Mesa})`}
        bgPos="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        minH="100dvh"
        display="grid"
        placeItems="center"
        px={4}
        py={{ base: 8, md: 12 }}
      >
        <Card.Root w="full" maxW="520px" shadow="lg" rounded="2xl">
          <Card.Header justifyContent="center" alignItems="center">
            <Heading size="lg" color={headingColor}>
              Confirma tu cuenta
            </Heading>
            <Text mt={1} color={textColor} fontSize="sm">
              Introduce el token que recibiste a tu correo electrónico
            </Text>
          </Card.Header>
          {/**cuando agregamos el onSubmit ya no funciona el action */}

          <Card.Body>
            <Form /*method="POST" action="/auth/register"*/ noValidate>
              <Field.Root invalid={!!formState.errors.token}>
                <Controller
                  control={control}
                  name="token"
                  render={({ field }) => (
                    <PinInput.Root
                      mask
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      onValueComplete={handleComplete}
                    >
                      <PinInput.HiddenInput />
                      <PinInput.Control>
                        <PinInput.Input index={0} />
                        <PinInput.Input index={1} />
                        <PinInput.Input index={2} />
                        <PinInput.Input index={3} />
                        <PinInput.Input index={4} />
                        <PinInput.Input index={5} />
                      </PinInput.Control>
                    </PinInput.Root>
                  )}
                />
                <Field.ErrorText>
                  {formState.errors.token?.message}
                </Field.ErrorText>
              </Field.Root>
            </Form>
          </Card.Body>

          <Card.Footer
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            justifyItems="center"
          >
            <Button
              size="lg"
              bg="brand.Cblue"
              color="white"
              _hover={{ bg: "brand.Cmint" }}
              loadingText="Creando..."
            >
              <a href="">Inicio</a>
            </Button>
            <Text fontSize="sm" color={textColor} textAlign="center">
              Solicita un nuevo token:{" "}
            </Text>
            <Button
              size="lg"
              bg="brand.Cblue"
              color="white"
              _hover={{ bg: "brand.Cmint" }}
              loadingText="Creando..."
            >
              <a href="/auth/request-code">Nuevo token</a>
            </Button>
          </Card.Footer>
          <Flex justify="space-between" gap="4" paddingX={2} paddingBottom={2}>
            <Button size="xs" variant="outline">
              <a href="/">Página principal</a>
            </Button>

            <ColorModeButton size="xs" />

            <Button size="xs" variant="outline">
              <a href="/">Ayuda</a>
            </Button>
          </Flex>
        </Card.Root>
      </Box>
    </>
  );
}
