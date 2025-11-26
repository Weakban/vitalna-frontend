import { useForm } from "react-hook-form";
import { Box, Button, Card, Heading, Link, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { type Service, type serviceFormData } from "@/types";
import bgServices from "../../assets/bgServices.jpg";
import {
  useFetcher,
  type ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import NewServiceForm from "@/components/Services/NewServiceForm";
import { getServiceById, updateService } from "@/api/ServicesAPI";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.id !== undefined) {
    console.log(+params.id);
    const service = await getServiceById(+params.id);

    if (!service) {
      return redirect("/services");
    }

    return service;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData()); // todo string

  try {
    if (params.id !== undefined) {
      console.log(params.id);
      toaster.promise(updateService(formData, +params.id), {
        loading: {
          title: "Editando servico...",
          description: "Un momento por favor",
        },
        success: {
          title: "Servicio Editado",
          description: "listo",
        },
        error: {
          title: "No se pudo Editar",
          description: "Verifica los datos e inténtalo de nuevo.",
        },
      });
    }
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ?? e?.message ?? "No se pudo crear la cuenta";
    return msg;
  }

  return {};
}

export default function EditServiceView() {
  //const {state} =useLocation()
  const service = useLoaderData() as Service;

  const fetcher = useFetcher();
  const initialValues: serviceFormData = {
    name: service?.name ?? "",
    price: service?.price ?? 500,
    durationMin: service?.durationMin ?? 60,
    description: service?.description ?? "",
    CategoryId: service?.category?.id ?? 2, // "HEALTH" | "BEAUTY" | undefined
    isActive: service?.isActive ?? true,
  };

  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.300");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ defaultValues: initialValues });

  const handleForm = async (formData: serviceFormData) => {
    fetcher.submit(formData, { method: "post" });
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
              Editar servicio
            </Heading>
            <Text mt={1} color={textColor} fontSize="sm">
              Edita el servicio
            </Text>
          </Card.Header>

          <Form onSubmit={handleSubmit(handleForm)} noValidate>
            <Card.Body>
              <NewServiceForm
                register={register}
                errors={errors}
                control={control}
                service={service}
              />
            </Card.Body>
            <Card.Footer
              justifyContent="space-between"
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
                <Link color="white" href="/services">
                  Cancelar
                </Link>
              </Button>

              <Button
                size="lg"
                bg="brand.Cblue"
                type="submit"
                _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
              >
                Guardar
              </Button>
            </Card.Footer>
          </Form>
        </Card.Root>
      </Box>
    </>
  );
}
