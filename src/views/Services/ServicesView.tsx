import { getAllServices } from "@/api/ServicesAPI";
import SearchServiceForm from "@/components/Services/SearchServiceForm";
import ServicesDetails from "@/components/Services/ServicesDetails";
import type { Service } from "@/types";

import { Box, Container, Stack, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { useColorModeValue } from "@/components/ui/color-mode";

export async function loader() {
  const services = await getAllServices();
  return services;
}

export default function ServicesView() {
  const services = useLoaderData() as Service[];
  const bgColor = useColorModeValue("bg.canvas", "bg.canvas");
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <>
      <Box bg={bgColor} minH="100vh">
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
              color={headingColor}
            >
              Servicios
            </Text>
            <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
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
