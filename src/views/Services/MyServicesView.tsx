import { getServiceByProfessionalId } from "@/api/ServicesAPI";
import SearchServiceForm from "@/components/Services/SearchServiceForm";
import ServicesDetails from "@/components/Services/ServicesDetails";
import type { Service } from "@/types";

import { Box, Button, Container, Stack, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useAuthStore } from "@/store/auth";
//const { profile } = useAuthStore.getState();
export async function loader() {
  const id = useAuthStore.getState().profile.professionalId;
  const services = await getServiceByProfessionalId(id);
  return services;
}

export default function MyServicesView() {
  const services = useLoaderData() as Service[];

  return (
    <>
      <Box bg="white">
        <Container maxW="6xl" py={{ base: 6, md: 10 }}>
          {/* Encabezado */}
          <Stack gap={2} mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color="brand.ink">
              Mis Servicios
            </Text>
            <Text color="blackAlpha.700">Administra tus servicios.</Text>
          </Stack>
          <SearchServiceForm />

          {/* AGREGA EL CÓDIGO AQUÍ */}

          <Box my={6}>
            <Button
              bg="brand.Cblue"
              color="white"
              _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
              width="100%"
              size="lg"
              asChild
            >
              <a href="/app/professional/create-service">
                {" "}
                <IoMdAdd fontSize="20px" /> Agregar Servicio
              </a>
            </Button>
          </Box>

          {services && services.length > 0 ? (
            // Si la condición es VERDADERA (hay servicios en el arreglo)
            services.map((service) => (
              <ServicesDetails key={service.id} service={service} mode="mine" />
            ))
          ) : (
            // Si la condición es FALSA (el arreglo es nulo, indefinido o está vacío)
            <Text fontStyle="italic" color="gray.500">
              Todavía no tienes servicios agregados
            </Text>
          )}
        </Container>
      </Box>
    </>
  );
}
