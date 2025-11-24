import { Box, Container, Heading, Text, Stack } from "@chakra-ui/react";
import Toalla from "../assets/Toalla.svg";
type HeroProps = {
  title: string;
  subtitle?: string;
};

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <Box
      bgImage={`url(${Toalla})`}
      bgPos="center"
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Box>
        <Container maxW={{ base: "2xs", md: "8xl" }}>
          <Stack py={{ base: 16, md: 24 }} gap={4} color="brand.ink" maxW="3xl">
            <Heading lineHeight="1.1" fontSize={{ base: "3xl", md: "5xl" }}>
              {title}
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }}>{subtitle}</Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
