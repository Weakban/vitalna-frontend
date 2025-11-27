import {
  Box,
  Text,
  Card,
  Button,
  Heading,
  Field,
  Flex,
  VStack,
  Separator,
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
        px={{ base: 3, md: 4 }}
        py={{ base: 6, md: 12 }}
      >
        <Card.Root
          w="full"
          maxW={{ base: "95%", sm: "460px", md: "520px" }}
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
              Confirma tu cuenta
            </Heading>
            <Text
              mt={{ base: 1, md: 2 }}
              color={textColor}
              fontSize={{ base: "xs", md: "sm" }}
              textAlign="center"
              px={{ base: 2, md: 0 }}
            >
              Introduce el código de 6 dígitos que recibiste en tu correo
            </Text>
          </Card.Header>
          {/**cuando agregamos el onSubmit ya no funciona el action */}

          <Card.Body px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
            <Form /*method="POST" action="/auth/register"*/ noValidate>
              <Field.Root invalid={!!formState.errors.token}>
                <Controller
                  control={control}
                  name="token"
                  render={({ field }) => (
                    <Flex width="100%" justifyContent="center">
                      <PinInput.Root
                        mask
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                        onValueComplete={handleComplete}
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
                  {formState.errors.token?.message}
                </Field.ErrorText>
              </Field.Root>
            </Form>
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
                asChild
                size={{ base: "md", md: "lg" }}
                w="full"
                bg="brand.Cblue"
                color="white"
                _hover={{ bg: "brand.Cmint", transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                <a href="/auth/login">Iniciar sesión</a>
              </Button>

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
                  borderColor={useColorModeValue("brand.Cblue", "brand.Cmint")}
                  color={useColorModeValue("brand.Cblue", "brand.Cmint")}
                  _hover={{
                    bg: useColorModeValue("brand.Cblue", "brand.Cmint"),
                    color: useColorModeValue("white", "brand.ink"),
                  }}
                >
                  <a href="/auth/request-code">Solicitar nuevo código</a>
                </Button>
              </Box>
            </VStack>
          </Card.Footer>
        </Card.Root>
      </Box>
    </>
  );
}
