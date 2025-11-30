import { getServiceByProfessionalId } from "@/api/ServicesAPI";
import SearchServiceForm from "@/components/Services/SearchServiceForm";
import ServicesDetails from "@/components/Services/ServicesDetails";
import type { Service } from "@/types";

import { Box, Button, Container, Stack, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useAuthStore } from "@/store/auth";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useState, useMemo } from "react";

//const { profile } = useAuthStore.getState();
export async function loader() {
  const id = useAuthStore.getState().profile.professionalId;
  const services = await getServiceByProfessionalId(id);
  return services;
}

export default function MyServicesView() {
  const servicesData = useLoaderData() as Service[];
  const services = Array.isArray(servicesData) ? servicesData : [];

  const bgColor = useColorModeValue("bg.canvas", "bg.canvas");
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.300");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("newest");

  // Filtrado y ordenamiento de servicios
  const filteredAndSortedServices = useMemo(() => {
    let filtered = [...services];

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(
        (service) => service.category.name === selectedCategory
      );
    }

    // Ordenar
    switch (selectedSort) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [services, searchTerm, selectedCategory, selectedSort]);

  return (
    <>
      <Box bg={bgColor} minH="100vh">
        <Container maxW="6xl" py={{ base: 6, md: 10 }}>
          {/* Encabezado */}
          <Stack gap={2} mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
              Mis Servicios
            </Text>
            <Text color={textColor}>Administra tus servicios.</Text>
          </Stack>

          <SearchServiceForm
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />

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
            filteredAndSortedServices.length === 0 ? (
              <Text
                fontStyle="italic"
                color={mutedColor}
                textAlign="center"
                py={6}
              >
                No se encontraron servicios con los filtros seleccionados.
              </Text>
            ) : (
              filteredAndSortedServices.map((service) => (
                <ServicesDetails
                  key={service.id}
                  service={service}
                  mode="mine"
                />
              ))
            )
          ) : (
            <Text fontStyle="italic" color={mutedColor}>
              Todavía no tienes servicios agregados
            </Text>
          )}
        </Container>
      </Box>
    </>
  );
}
