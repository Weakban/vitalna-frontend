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
import { useColorModeValue } from "@/components/ui/color-mode";
import { MdWorkOutline } from "react-icons/md"; // Importamos un ícono

type ProfessionalCardProps = {
  professional: Professional;
};
export default function ProfessionalCard({
  professional,
}: ProfessionalCardProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const specialtyColor = useColorModeValue("gray.500", "gray.400");
  const bioColor = useColorModeValue("gray.600", "gray.300");

  return (
    <GridItem
      key={professional.id}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
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
          <Avatar.Root
            bg={{
              base: "brand.Cmint",
              _dark: "brand.Cblue",
            }}
            size="xl"
          >
            <Avatar.Fallback name={professional.user.name} />
            <Avatar.Image src="https://bit.ly/dan-abramov" />
          </Avatar.Root>
          <VStack gap={1}>
            <Heading size="md" textAlign="center">
              {professional.user.name}
            </Heading>
            <HStack color={specialtyColor}>
              <Icon as={MdWorkOutline} color="currentColor" />
              <Text fontSize="sm">{professional.specialty}</Text>
            </HStack>
          </VStack>
        </VStack>
        {/* Biografía */}
        <Text color={bioColor} fontSize="sm" textAlign="center" lineClamp={3}>
          {professional.bio}
        </Text>
        <Spacer /> {/* Este componente empuja el botón hacia abajo */}
        {/* Botón de Acción */}
        <Button
          bg={{
            base: "brand.Cblue",
            _dark: "brand.Cmint",
          }}
          _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
          asChild
        >
          <a href={`/app/professionalInfo/${professional.id}`}>Ver perfil</a>
        </Button>
      </VStack>
    </GridItem>
  );
}
