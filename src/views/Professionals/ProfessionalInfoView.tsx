// src/components/ProfessionalProfile.tsx

// src/components/ProfessionalProfile.tsx

import {
  Box,
  VStack,
  HStack,
  Avatar,
  Heading,
  Text,
  Button,
  Tabs,
  Icon,
  Spacer,
  AvatarGroup,
} from "@chakra-ui/react";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import type { Professional, Service } from "../../types/index.ts";
import { getProfessionalById } from "@/api/ProfessionalsAPI.ts";
import {
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router-dom";
import ServicesDetails from "@/components/Services/ServicesDetails.tsx";
import { getServiceByProfessionalId } from "@/api/ServicesAPI.ts";
import { useAuthStore } from "@/store/auth.ts";
import {
  ErrorBoundary,
  ProfessionalErrorFallback,
} from "@/components/ui/ErrorBoundary";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    if (!params.id) {
      throw new Error("ID del profesional no proporcionado");
    }

    const professionalId = +params.id;
    if (isNaN(professionalId)) {
      throw new Error("ID del profesional inválido");
    }

    console.log("Cargando profesional con ID:", professionalId);

    const { token } = useAuthStore.getState();

    // Verificar que hay token disponible
    if (!token) {
      return redirect("/auth/login");
    }

    // Cargar datos en paralelo para mejor rendimiento
    const [professional, services] = await Promise.all([
      getProfessionalById(professionalId),
      getServiceByProfessionalId(professionalId),
    ]);

    if (!professional) {
      return redirect("/app/professionals");
    }

    return { professional, services: services || [] };
  } catch (error) {
    console.error("Error en loader de ProfessionalInfoView:", error);
    return redirect("/app/professionals");
  }
}

export default function ProfessionalInfoView() {
  const loaderData = useLoaderData() as {
    professional: Professional;
    services: Service[];
  }; // Validación defensiva de datos
  if (!loaderData || !loaderData.professional) {
    return (
      <Box p={{ base: 4, md: 8 }} maxWidth="900px" mx="auto">
        <VStack gap={4}>
          <Text fontSize="lg">
            No se pudo cargar la información del profesional
          </Text>
          <Button onClick={() => window.history.back()}>Volver atrás</Button>
        </VStack>
      </Box>
    );
  }

  const { professional, services = [] } = loaderData;

  return (
    <ErrorBoundary fallback={ProfessionalErrorFallback}>
      <Box p={{ base: 4, md: 8 }} maxWidth="900px" mx="auto">
        {/* SECCIÓN DEL ENCABEZADO (sin cambios) */}
        <HStack gap={{ base: 4, md: 6 }} align="start">
          <AvatarGroup>
            <Avatar.Root size={{ base: "xl", md: "2xl" }}>
              <Avatar.Fallback
                //name={`${professional.firstName} ${professional.lastName}`}
                name={professional.user.name}
              />

              <Avatar.Image src="https://bit.ly/dan-abramov" />
            </Avatar.Root>
          </AvatarGroup>
          <VStack align="start" gap={1}>
            <Heading as="h1" size={{ base: "lg", md: "xl" }}>
              {professional.user.name}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="purple.500"
              fontWeight="bold"
            >
              {professional.specialty}
            </Text>
            <HStack gap={4} pt={2} color="gray.600">
              <HStack>
                <Icon as={MdLocationOn} />
                <Text fontSize="sm">"Ciudad de México, México"</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>

        <HStack gap={4} mt={6}>
          <Button colorScheme="purple">
            Contactar por Email
            <Icon as={MdEmail} />
          </Button>
          <Button variant="outline">
            Llamar ahora
            <Icon as={MdPhone} />
          </Button>
        </HStack>

        <Spacer my={8} />

        {/* SECCIÓN DE PESTAÑAS CON LA NUEVA API */}
        <Tabs.Root defaultValue="about" variant="enclosed" colorScheme="purple">
          <Tabs.List>
            <Tabs.Trigger value="about">Sobre mí</Tabs.Trigger>
            <Tabs.Trigger value="credentials">Credenciales</Tabs.Trigger>
            <Tabs.Trigger value="services">Servicios</Tabs.Trigger>
          </Tabs.List>

          {/* Panel: Sobre mí */}
          <Tabs.Content value="about" pt={4}>
            <Heading as="h3" size="md" mb={4}>
              Acerca de mí
            </Heading>
            <Text color="gray.700" whiteSpace="pre-wrap">
              {professional.bio}
            </Text>
          </Tabs.Content>

          {/* Panel: Credenciales     nota: Agregar una tabla relacionada con el profecional de credenciales
        <Tabs.Content value="credentials" pt={4}>
          <VStack gap={4} align="stretch">
            {professional.credentials.map((cred, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                <Text fontWeight="bold">{cred.title}</Text>
                <Text color="gray.600">
                  {cred.institution} - {cred.year}
                </Text>
              </Box>
            ))}
          </VStack>
        </Tabs.Content>*/}

          {/* Panel: Servicios   nta: agregar al type el campo de servicios para poder listarlos*/}
          <Tabs.Content value="services" pt={4}>
            {services && services.length > 0 ? (
              // Si la condición es VERDADERA (hay servicios en el arreglo)
              services.map((service) => (
                <ServicesDetails
                  key={service.id}
                  service={service}
                  mode="all"
                />
              ))
            ) : (
              // Si la condición es FALSA (el arreglo es nulo, indefinido o está vacío)
              <Text fontStyle="italic" color="gray.500">
                Este usuario no tiene servicios publicados.
              </Text>
            )}
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </ErrorBoundary>
  );
}
