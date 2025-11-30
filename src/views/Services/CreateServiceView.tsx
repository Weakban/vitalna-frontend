import { useForm } from "react-hook-form";
import { Box, Button, Card, Heading, Text } from "@chakra-ui/react";
import { type serviceFormData } from "@/types";
import bgServices from "../../assets/bgServices.jpg";
import { useFetcher, type ActionFunctionArgs, Form } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import NewServiceForm from "@/components/Services/NewServiceForm";
import { createNewService } from "@/api/ServicesAPI";
import { useColorModeValue } from "@/components/ui/color-mode";

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData()); // todo string
  try {
    toaster.promise(createNewService(formData), {
      loading: {
        title: "Agregando servico...",
        description: "Un momento por favor",
      },
      success: {
        title: "Servicio Agregado",
        description: "listo",
      },
      error: {
        title: "No se pudo agregar",
        description: "Verifica los datos e inténtalo de nuevo.",
      },
    });
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? "No se pudo crear la cuenta";
    return msg;
  }

  return {};
}

export default function CreateServiceView() {
  const fetcher = useFetcher();
  const initialValues: serviceFormData = {
    name: "",
    description: "",
    price: "" as any,
    durationMin: "" as any,
    CategoryId: 1,
    isActive: true,
  };

  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.300");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({ defaultValues: initialValues });

  const handleForm = async (formData: serviceFormData) => {
    fetcher.submit(formData, { method: "post" /*action: "/create-service"*/ });
    reset();
  };

  return (
    <>
      <Box
        bgImage={`url(${bgServices})`}
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
              Nuevo servicio
            </Heading>
            <Text mt={1} color={textColor} fontSize="sm">
              Agrega un servicio de salud y belleza a tu perfil
            </Text>
          </Card.Header>
          {/**cuando agregamos el onSubmit ya no funciona el action */}
          <Form onSubmit={handleSubmit(handleForm)} noValidate>
            <Card.Body>
              <NewServiceForm
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
              <Button
                size="lg"
                bg="brand.Cblue"
                color="white"
                _hover={{ bg: "brand.Cmint" }}
              >
                <a href="/services">Cancelar</a>
              </Button>

              <Button
                size="lg"
                bg="brand.Cblue"
                color="white"
                _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
                type="submit"
              >
                Agregar
              </Button>
            </Card.Footer>
          </Form>
        </Card.Root>
      </Box>
    </>
  );
}
