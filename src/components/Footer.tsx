import { Box, Container, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="brand.CgrayH" color="white">
      <Container maxW="6xl" py={6}>
        <Text fontSize="sm">
          © {new Date().getFullYear()} Vitalná. Todos los derechos reservados.
        </Text>
      </Container>
    </Box>
  );
}
