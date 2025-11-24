import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Text,
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
            <Heading size="lg" color="brand.ink">
              ¿Necesitas un codigo nuevo de confirmación?
            </Heading>
            <Text mt={1} color="blackAlpha.700" fontSize="sm">
              Ingresa tu correo electrónico
            </Text>
          </Card.Header>
          {/**cuando agregamos el onSubmit ya no funciona el action */}
          <Form
            /* method="POST"
            action="/auth/register"*/
            onSubmit={handleSubmit(handleForm)}
            noValidate
          >
            <Card.Body>
              <Field.Root invalid={!!errors.email}>
                <Field.Label>Correo electrónico</Field.Label>
                <Input
                  id="email"
                  placeholder="Introduce tu correo electrónico "
                  {...register("email", {
                    required: "El correo electrónico es obligatorio",
                  })}
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>
            </Card.Body>

            <Card.Footer
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              justifyItems="center"
            >
              <Button
                type="submit"
                size="lg"
                bg="brand.Cblue"
                color="white"
                _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
              >
                Solicitar
              </Button>
            </Card.Footer>
          </Form>
          <Flex justify="space-between" gap="4" paddingX={2}>
            <Button size="xs" variant="outline">
              <a href="/">Página principal</a>
            </Button>

            <Button size="xs" variant="outline">
              <a href="/">Ayuda</a>
            </Button>
          </Flex>
        </Card.Root>
      </Box>
    </>
  );
}

//<a href="/auth/confirm-account">Solicitar</a>
