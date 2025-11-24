import type { Professional } from "@/types";
import {
  Button,
  Text,
  GridItem,
  Avatar,
  VStack,
  Heading,
  HStack,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { MdWorkOutline } from "react-icons/md"; // Importamos un ícono

type ProfessionalCardProps = {
  professional: Professional;
};
export default function ProfessionalCard({
  professional,
}: ProfessionalCardProps) {
  return (
    <GridItem
      key={professional.id}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl" // Bordes más redondeados
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
      display="flex" // Hacemos que el GridItem sea un flex container
      flexDirection="column" // Apilamos el contenido verticalmente
    >
      <VStack p={6} gap={4} align="stretch" flex="1">
        {/* Encabezado con Avatar y Nombre */}
        <VStack gap={4}>
          <Avatar.Root size="xl">
            <Avatar.Fallback name={professional.user.name} />
            <Avatar.Image src="https://bit.ly/dan-abramov" />
          </Avatar.Root>
          <VStack gap={1}>
            <Heading size="md" textAlign="center">
              {professional.user.name}
            </Heading>
            <HStack color="gray.500">
              <Icon as={MdWorkOutline} />
              <Text fontSize="sm">{professional.specialty}</Text>
            </HStack>
          </VStack>
        </VStack>
        {/* Biografía */}
        <Text color="gray.600" fontSize="sm" textAlign="center" lineClamp={3}>
          {professional.bio}
        </Text>
        <Spacer /> {/* Este componente empuja el botón hacia abajo */}
        {/* Botón de Acción */}
        <Button asChild>
          <a href={`/app/professionalInfo/${professional.id}`}>Ver perfil</a>
        </Button>
      </VStack>
    </GridItem>
  );
}

/*
  <Button
          width="100%"
          onClick={() => navigate(`/app/professionalInfo/${professional.id}`)}
        >
          Ver perfil
        </Button>
        */
