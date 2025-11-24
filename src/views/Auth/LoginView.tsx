import { Box, Text, Card, Button, Heading, Flex } from "@chakra-ui/react";
import {
  Form,
  redirect,
  useActionData,
  useFetcher,
  useNavigate,
  type ActionFunctionArgs,
} from "react-router-dom";
import LoginForm from "@/components/Auth/LoginForm";
import { useForm } from "react-hook-form";
import type { LoginFormData } from "@/types";
import Mesa from "../../assets/Mesa.jpg";
import { toaster } from "@/components/ui/toaster";
import { login, getProfileData } from "@/api/AuthAPI";
import { useAuthStore } from "../../store/auth";
const { setToken, setIsAuth, setProfile } = useAuthStore.getState();

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData()); // todo string

  try {
    //llamamos a api
    //El promise espera una promesa la cual es la respuesta de nuestra api
    const tokenPromise = login(formData);

    toaster.promise(tokenPromise, {
      loading: {
        title: "iniciando sesion...",
        description: "Un momento por favor",
      },
      success: {
        title: "Bienvenido",
        description: "Credenciales correctas",
      },
      error: (error: any) => ({
        title: "Credenciales inválidas",
        description: error.message,
      }),
    });

    const tokenResolved = await tokenPromise;
    if (tokenResolved) {
      setIsAuth();
      setToken(tokenResolved);
      const profileInfo = await getProfileData(tokenResolved);
      setProfile(profileInfo);
    }

    return redirect("/app/services");
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? "No se pudo crear la cuenta";
    return { error: msg };
  }
}

export default function LoginView() {
  const fetcher = useFetcher();
  const initialValues: LoginFormData = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues });

  const handleForm = async (formData: LoginFormData) => {
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
              Inicia sesión
            </Heading>
            <Text mt={1} color="blackAlpha.700" fontSize="sm">
              Inicia sesión para reservar servicios de bienestar y belleza.
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
              <LoginForm register={register} errors={errors} />
            </Card.Body>
            <Card.Footer
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              justifyItems="center"
            >
              <Text fontSize="sm" color="blackAlpha.700" textAlign="center">
                ¿Todavía no tienes una cuenta?
              </Text>
              <Button
                size="lg"
                bg="brand.Cblue"
                color="white"
                _hover={{ bg: "brand.Cmint" }}
                loadingText="Creando..."
              >
                <a href="/auth/register">Crear cuenta</a>
              </Button>

              <Button
                type="submit"
                size="lg"
                bg="brand.Cblue"
                color="white"
                _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
              >
                Iniciar sesión
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
