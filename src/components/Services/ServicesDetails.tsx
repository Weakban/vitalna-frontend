import type { Service } from "@/types";
import {
  Button,
  Card,
  HStack,
  Image,
  Text,
  Box,
  Badge,
  //Checkbox,
  VStack,
  Grid,
} from "@chakra-ui/react";
import Toalla from "../../assets/Toalla.png";
import { formatCurrency } from "@/utils";
import {
  Form,
  useNavigate,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import { deleteService } from "@/api/ServicesAPI";

type ServiceDetailsProps = {
  service: Service;
  mode: "all" | "mine";
};

export async function deleteAction({ params }: ActionFunctionArgs) {
  if (params.id !== undefined) {
    await deleteService(+params.id);
    return redirect("/app/services");
  }
}

export default function ServicesDetails({
  service,
  mode,
}: ServiceDetailsProps) {
  const price = formatCurrency(service.price); //Formato de precio
  const navigate = useNavigate();
  let category = "";
  if (service.category.name === "HEALTH") {
    category = "SALUD";
  } else {
    category = "BELLEZA";
  }

  return (
    <>
      <Box paddingY={{ base: 2, md: 3 }} maxW="5xl" w="full">
        <Card.Root
          rounded={{ base: "lg", md: "2xl" }}
          overflow="hidden"
          borderWidth="1px"
          borderRadius="lg"
          flexDirection={{ base: "column", md: "row" }}
          transition="all 0.2s"
          _hover={{
            transform: { base: "scale(1.01)", md: "scale(1.03)" },
            shadow: "lg",
          }}
        >
          <Image
            src={Toalla}
            alt={service.name}
            maxW={{ base: "full", md: "300px", lg: "500px" }}
            h={{ base: "200px", md: "auto" }}
            objectFit="cover"
          />

          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={{ base: 3, md: 4 }}
            p={{ base: 4, md: 6 }}
            flex="1"
          >
            {/* Columna izquierda */}
            <Box>
              <Card.Title
                fontWeight="semibold"
                fontSize={{ base: "lg", md: "xl" }}
              >
                {service.name}
              </Card.Title>
              <Text
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "md" }}
                mt={1}
              >
                Profesional: {service.provider.user.name}
              </Text>
              <Card.Description fontSize={{ base: "sm", md: "md" }} mt={2}>
                {service.description}
              </Card.Description>
              <HStack
                mt={{ base: 2, md: 3 }}
                gap={{ base: 2, md: 3 }}
                flexWrap="wrap"
              >
                {service.category && (
                  <Badge size={{ base: "sm", md: "md" }}>{category}</Badge>
                )}
                <Badge colorScheme="purple" size={{ base: "sm", md: "md" }}>
                  ★★★★★
                </Badge>
              </HStack>
            </Box>

            {/* Columna derecha */}
            <VStack
              align="stretch"
              gap={{ base: 2, md: 3 }}
              mt={{ base: 4, lg: 0 }}
            >
              <Text
                fontWeight="bold"
                fontSize={{ base: "xl", md: "2xl" }}
                color="green.600"
              >
                {price}
              </Text>
              {mode === "mine" ? (
                <>
                  <Button
                    bg="brand.Cblue"
                    color="white"
                    size={{ base: "sm", md: "md" }}
                    _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
                    onClick={() =>
                      navigate(`/app/professional/services/${service.id}/edit`)
                    }
                  >
                    Editar
                  </Button>

                  <Form
                    method="post"
                    action={`/app/professional/services/${service.id}/delete`}
                    onSubmit={(e) => {
                      if (!confirm("Estas seguro de eliminar el servicio?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Button
                      width="100%"
                      bg="red"
                      color="white"
                      size={{ base: "sm", md: "md" }}
                      type="submit"
                      _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
                    >
                      Eliminar
                    </Button>
                  </Form>
                </>
              ) : (
                <>
                  <Button
                    bg="brand.Cblue"
                    color="white"
                    size={{ base: "sm", md: "md" }}
                    _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
                    onClick={() => navigate(`/app/booking/${service.id}`)}
                  >
                    Reservar
                  </Button>
                  {/* 
                  <Checkbox.Root size={{ base: "md", md: "lg" }}>
                    <Checkbox.Control />
                    <Checkbox.Label fontSize={{ base: "sm", md: "md" }}>
                      Favorito
                    </Checkbox.Label>
                  </Checkbox.Root>
                  */}
                </>
              )}
            </VStack>
          </Grid>
        </Card.Root>
      </Box>
    </>
  );
}
