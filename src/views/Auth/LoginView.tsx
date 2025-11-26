import { Box, Text, Card, Button, Heading, Flex } from "@chakra-ui/react";
import {
  Form,
  redirect,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router-dom";
import LoginForm from "@/components/Auth/LoginForm";
import { useForm } from "react-hook-form";
import type { LoginFormData } from "@/types";
import Mesa from "../../assets/Mesa.jpg";
import { toaster } from "@/components/ui/toaster";
import { login, getProfileData } from "@/api/AuthAPI";
import { useAuthStore } from "../../store/auth";
import { useColorModeValue, ColorModeButton } from "@/components/ui/color-mode";
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
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("brand.ink", "white");
  const linkColor = useColorModeValue("brand.Cblue", "brand.Cmint");

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
        <Card.Root w="full" maxW="540px" shadow="2xl" rounded="3xl">
          <Flex
            justify="space-between"
            gap="4"
            px={{ base: 4, md: 6 }}
            pt={{ base: 4, md: 5 }}
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
            pb={{ base: 2, md: 3 }}
          >
            <Heading
              size={{ base: "lg", md: "xl" }}
              color={headingColor}
              fontWeight="bold"
              letterSpacing="tight"
            >
              Inicia sesión
            </Heading>
            <Text
              mt={2}
              color={textColor}
              fontSize={{ base: "sm", md: "md" }}
              textAlign="center"
              lineHeight="tall"
            >
              Accede a tu cuenta de Vitalná
            </Text>
          </Card.Header>
          {/**cuando agregamos el onSubmit ya no funciona el action */}
          <Form
            /* method="POST"
            action="/auth/register"*/
            onSubmit={handleSubmit(handleForm)}
            noValidate
          >
            <Card.Body px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
              <LoginForm register={register} errors={errors} />
            </Card.Body>
            <Card.Footer
              flexDirection="column"
              gap={{ base: 4, md: 5 }}
              px={{ base: 4, md: 6 }}
              py={{ base: 6, md: 8 }}
            >
              <Button
                type="submit"
                size={{ base: "lg", md: "xl" }}
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
                Iniciar sesión
              </Button>

              <Box textAlign="center">
                <Text fontSize="sm" color={textColor} display="inline">
                  ¿Todavía no tienes cuenta?{" "}
                </Text>
                <Button
                  asChild
                  variant="plain"
                  size="sm"
                  color={linkColor}
                  fontWeight="semibold"
                  _hover={{ textDecoration: "underline" }}
                  px={1}
                >
                  <a href="/auth/register">Crear una</a>
                </Button>
              </Box>
            </Card.Footer>
          </Form>
        </Card.Root>
      </Box>
    </>
  );
}
