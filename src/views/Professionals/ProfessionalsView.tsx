import { getAllProfessionals } from "@/api/ProfessionalsAPI";
import ProfessionalsDetails from "@/components/Professionals/ProfessionalsDetails";
import type { Professional } from "@/types";

import { Box, Container, Grid, Stack, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { useColorModeValue } from "@/components/ui/color-mode";

export async function loader() {
  const Professionals = await getAllProfessionals();
  return Professionals;
}

export default function ProfessionalsView() {
  const Professionals = useLoaderData() as Professional[];

  const bgColor = useColorModeValue("bg.canvas", "bg.canvas");
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("blackAlpha.700", "gray.300");

  return (
    <>
      <Box bg={bgColor} minH="100vh">
        <Container maxW="6xl" py={{ base: 6, md: 10 }}>
          {/* Encabezado */}
          <Stack gap={2} mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
              Profesionales
            </Text>
            <Text color={textColor}>
              Encuentra a los profesionales de salud y belleza que conforman
              vitalná.
            </Text>
          </Stack>
          {/*<SearchServiceForm />*/}

          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
            p={6}
          >
            {Professionals.map((profesional) => (
              <ProfessionalsDetails
                key={profesional.id}
                professional={profesional}
                //mode="all"
              />
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
