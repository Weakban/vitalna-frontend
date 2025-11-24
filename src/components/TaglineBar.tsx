import { Box, Container, Text } from "@chakra-ui/react";

export default function TaglineBar({ text }: { text: string }) {
  return (
    <Box bg="brand.Cmint">
      <Container maxW="6xl" py={2}>
        <Text textAlign="center" fontWeight="semibold" color="colors.brand.ink">
          {text}
        </Text>
      </Container>
    </Box>
  );
}
