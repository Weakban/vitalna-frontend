import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function HydrateFallback() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box
      bg={bgColor}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={4}>
        <Spinner size="xl" color="brand.Cblue" borderWidth="4px" />
        <Text color={textColor} fontSize="lg" fontWeight="medium">
          Cargando...
        </Text>
      </VStack>
    </Box>
  );
}
