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
          <Flex
            justify="space-between"
            gap="4"
            px={{ base: 3, md: 4 }}
            pt={{ base: 3, md: 4 }}
          >
            <Button asChild size={{ base: "xs", md: "sm" }} variant="outline">
              <a href="/">Página principal</a>
            </Button>

            <Button asChild size={{ base: "xs", md: "sm" }} variant="outline">
              <a href="/">Ayuda</a>
            </Button>
          </Flex>
          <Card.Header
            justifyContent="center"
            alignItems="center"
            px={{ base: 4, md: 6 }}
          >
            <Heading size={{ base: "md", md: "lg" }} color="brand.ink">
              Crea tu cuenta
            </Heading>
            <Text
              mt={1}
              color="blackAlpha.700"
              fontSize={{ base: "xs", md: "sm" }}
              textAlign="center"
            >
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
              flexDirection="column"
              gap={{ base: 3, md: 4 }}
              px={{ base: 4, md: 6 }}
              py={{ base: 6, md: 8 }}
            >
              <Text
                fontSize="sm"
                color="blackAlpha.700"
                textAlign="center"
                mt={2}
              >
                Llena el formulario para:{" "}
              </Text>
              <Button
                type="submit"
                size={{ base: "md", md: "lg" }}
                w="full"
                bg="brand.Cblue"
                color="white"
                _hover={{ bg: "brand.Cmint" }}
                loadingText="Creando..."
              >
                Crear cuenta
              </Button>
              <Text fontSize="sm" color="blackAlpha.700" textAlign="center">
                ¿Ya tienes cuenta?{" "}
              </Text>
              <Button
                asChild
                size={{ base: "md", md: "lg" }}
                w="full"
                bg="brand.Cblue"
                color="white"
                _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
              >
                <a href="/auth/login">Iniciar Sesión</a>
              </Button>
            </Card.Footer>
          </Form>
        </Card.Root>
      </Box>
    </>
  );
}
