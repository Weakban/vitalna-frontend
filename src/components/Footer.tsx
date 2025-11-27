import {
  Box,
  Container,
  Text,
  Grid,
  Stack,
  Separator,
  Heading,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function Footer() {
  const bgColor = useColorModeValue("brand.ink", "gray.900");
  const textColor = useColorModeValue("gray.300", "gray.400");
  const headingColor = useColorModeValue("white", "white");
  const accentColor = useColorModeValue("brand.Cmint", "brand.Cmint");
  const borderColor = useColorModeValue("whiteAlpha.200", "whiteAlpha.200");

  return (
    <Box bg={bgColor} color={textColor} pt={{ base: 12, md: 16 }} pb={8}>
      <Container maxW="7xl">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "2fr 1.5fr 1.5fr",
          }}
          gap={{ base: 10, md: 12 }}
          mb={10}
        >
          {/* Columna 1: Institución y Proyecto */}
          <Stack gap={5}>
            <Box>
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color={accentColor}
                mb={3}
              >
                Vitalná
              </Heading>
              <Text fontSize="sm" lineHeight="tall" mb={4}>
                Plataforma web enfocada en la comercialización de servicios del
                sector salud y belleza
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" color={headingColor} mb={2}>
                Instituto Politécnico Nacional
              </Text>
              <Text fontSize="xs" lineHeight="relaxed">
                Escuela Superior de Ingeniería Mecánica y Eléctrica
                <br />
                <Text as="span" fontWeight="semibold">
                  ESIME Zacatenco
                </Text>
              </Text>
              <Text
                fontSize="xs"
                mt={2}
                color={accentColor}
                fontWeight="medium"
              >
                Ingeniería en Comunicaciones y Electrónica
              </Text>
              <Text fontSize="xs" color={textColor}>
                Academia de Computación
              </Text>
            </Box>
          </Stack>

          {/* Columna 2: Asesores */}
          <Stack gap={4}>
            <Heading
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color={headingColor}
              borderBottom="2px solid"
              borderColor={accentColor}
              pb={2}
            >
              Asesores del Proyecto
            </Heading>

            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={accentColor}
                mb={2}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Asesoras Técnicas
              </Text>
              <Stack gap={1}>
                <Text fontSize="xs" lineHeight="relaxed">
                  • Dra. Elena Acevedo Mosqueda
                </Text>
                <Text fontSize="xs" lineHeight="relaxed">
                  • Dra. Sandra Dinora Orantes Jiménez
                </Text>
              </Stack>
            </Box>

            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={accentColor}
                mb={2}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Asesor Metodológico
              </Text>
              <Text fontSize="xs" lineHeight="relaxed">
                • Ing. Federico Felipe Durán
              </Text>
            </Box>
          </Stack>

          {/* Columna 3: Desarrollador */}
          <Stack gap={4}>
            <Heading
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color={headingColor}
              borderBottom="2px solid"
              borderColor={accentColor}
              pb={2}
            >
              Desarrollo
            </Heading>

            <Box>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={accentColor}
                mb={2}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Desarrollador
              </Text>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color={headingColor}
                mb={1}
              >
                Iván Alejandro Abarca Pérez
              </Text>
              <Text fontSize="xs" lineHeight="relaxed">
                Proyecto de Titulación
                <br />
                {new Date().getFullYear()}
              </Text>
            </Box>

            <Box
              bg={useColorModeValue("whiteAlpha.100", "whiteAlpha.50")}
              p={3}
              borderRadius="md"
              borderLeft="3px solid"
              borderColor={accentColor}
            >
              <Text fontSize="xs" lineHeight="relaxed" fontStyle="italic">
                Sistema desarrollado como trabajo terminal para la obtención del
                título profesional
              </Text>
            </Box>
          </Stack>
        </Grid>

        <Separator borderColor={borderColor} mb={6} />

        {/* Footer Bottom */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="xs" textAlign={{ base: "center", md: "left" }}>
            © {new Date().getFullYear()} Vitalna - Instituto Politécnico
            Nacional.
            <br className="md:hidden" />
            Todos los derechos reservados.
          </Text>
          <Text fontSize="xs" color={accentColor} fontWeight="medium">
            Proyecto de Titulación - ESIME Zacatenco
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
