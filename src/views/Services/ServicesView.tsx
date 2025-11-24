import { getAllServices } from "@/api/ServicesAPI";
import SearchServiceForm from "@/components/Services/SearchServiceForm";
import ServicesDetails from "@/components/Services/ServicesDetails";
import type { Service } from "@/types";

import { Box, Container, Stack, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const services = await getAllServices();
  return services;
}

export default function ServicesView() {
  const services = useLoaderData() as Service[];

  return (
    <>
      <Box bg="white">
        <Container
          maxW="6xl"
          py={{ base: 4, md: 8, lg: 10 }}
          px={{ base: 4, md: 6 }}
        >
          {/* Encabezado */}
          <Stack gap={{ base: 1, md: 2 }} mb={{ base: 4, md: 6 }}>
            <Text
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              color="brand.ink"
            >
              Servicios
            </Text>
            <Text color="blackAlpha.700" fontSize={{ base: "sm", md: "md" }}>
              Encuentra el tratamiento ideal para tu bienestar.
            </Text>
          </Stack>
          <SearchServiceForm />

          {services.map((service) => (
            <ServicesDetails key={service.id} service={service} mode="all" />
          ))}
        </Container>
      </Box>
    </>
  );
}
