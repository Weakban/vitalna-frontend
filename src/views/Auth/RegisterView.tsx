import { useForm } from "react-hook-form";
import { Box, Button, Card, Flex, Heading, Text } from "@chakra-ui/react";
import RegisterForm from "@/components/Auth/RegisterForm";
import { type RegisterFormData } from "@/types";
import Mesa from "../../assets/Mesa.jpg";
import { createAccount } from "@/api/AuthAPI";
import { useFetcher, type ActionFunctionArgs, Form } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData()); // todo string

  try {
    //llamamos a api
    //El promise espera una promesa la cual es la respuesta de nuestra api
    toaster.promise(createAccount(formData), {
      loading: {
        title: "Creando tu cuenta...",
        description: "Un momento por favor",
      },
      success: (data) => ({
        title: data,
        description: "Registro exitoso",
      }),
      error: (data) => ({
        title: "No se pudo registrar",
        description: data,
      }),
    });
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? "No se pudo crear la cuenta";
    return msg;
  }
  return;
}

export default function RegisterView() {
  const fetcher = useFetcher();
  const initialValues: RegisterFormData = {
    email: "",
    name: "",
    password: "",
    role: "CLIENT",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({ defaultValues: initialValues });

  const handleForm = async (formData: RegisterFormData) => {
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
          <Flex justify="space-between" gap="4" paddingX={2}>
            <Button size="xs" variant="outline">
              <a href="/">Página principal</a>
            </Button>

            <Button size="xs" variant="outline">
              <a href="/">Ayuda</a>
            </Button>
          </Flex>
          <Card.Header justifyContent="center" alignItems="center">
            <Heading size="lg" color="brand.ink">
              Crea tu cuenta
            </Heading>
            <Text mt={1} color="blackAlpha.700" fontSize="sm">
              Únete a Vitalná para reservar/ofrecer servicios de bienestar y
              belleza.
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
              <RegisterForm
                register={register}
                errors={errors}
                control={control}
              />
            </Card.Body>

            <Card.Footer
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              justifyItems="center"
            >
              <Text fontSize="sm" color="blackAlpha.700" textAlign="center">
                ¿Ya tienes cuenta?{" "}
              </Text>
              <Button
                size="lg"
                bg="brand.Cblue"
                color="white"
                _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
                onClick={() =>
                  toaster.create({
                    description: "Toast",
                    type: "info",
                  })
                }
              >
                <a href="/auth/login">Iniciar Sesión</a>
              </Button>
              <Text fontSize="sm" color="blackAlpha.700" textAlign="center">
                Llena el formulario para:{" "}
              </Text>
              <Button
                type="submit"
                size="lg"
                bg="brand.Cblue"
                color="white"
                _hover={{ bg: "brand.Cmint" }}
                loadingText="Creando..."
              >
                Crear cuenta
              </Button>
            </Card.Footer>
          </Form>
        </Card.Root>
      </Box>
    </>
  );
}
