import { getAllServices } from "@/api/ServicesAPI";
import SearchServiceForm from "@/components/Services/SearchServiceForm";
import ServicesDetails from "@/components/Services/ServicesDetails";
import type { Service } from "@/types";

import { Box, Container, Stack, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useState, useMemo } from "react";

export async function loader() {
  const services = await getAllServices();
  return services;
}

export default function ServicesView() {
  const services = useLoaderData() as Service[];
  const bgColor = useColorModeValue("bg.canvas", "bg.canvas");
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("gray.700", "gray.300");

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSort, setSelectedSort] = useState("newest");

  // Filtrado y ordenamiento de servicios
  const filteredAndSortedServices = useMemo(() => {
    let filtered = [...services];

    // Filtrar por término de búsqueda (nombre o descripción)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          service.provider.specialty.toLowerCase().includes(searchLower)
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

          <SearchServiceForm
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />

          {filteredAndSortedServices.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text color={textColor} fontSize="lg">
                No se encontraron servicios con los filtros seleccionados.
              </Text>
            </Box>
          ) : (
            filteredAndSortedServices.map((service) => (
              <ServicesDetails key={service.id} service={service} mode="all" />
            ))
          )}
        </Container>
      </Box>
    </>
  );
}
