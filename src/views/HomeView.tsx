import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  Image,
  Card,
  Grid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Hero image
import HeroImage from "../assets/HomeSVGS/Salud_RectangleCorazonTech.svg";

// Salud images
import MedicinaFamiliar from "../assets/HomeSVGS/Salud_MedicinaFamiliar.svg";
import MedicinaTecnologica from "../assets/HomeSVGS/Salud_MedicinaTecnologica.svg";
import Nutricion from "../assets/HomeSVGS/Salud_Nutricion.svg";
import Pediatria from "../assets/HomeSVGS/Salud_Pediatria.svg";

// Belleza images
import Maquillaje from "../assets/HomeSVGS/Belleza_Maquillaje.svg";
import Pedicure from "../assets/HomeSVGS/Belleza_Pedicure.svg";
import Spa from "../assets/HomeSVGS/Belleza_Spa.svg";
import TratamientoFacial from "../assets/HomeSVGS/Belleza_TratamientoFacial.svg";

// About image
import Espejo1 from "../assets/Espejo1.svg";
import Toalla from "../assets/Toalla.svg";
export default function HomeView() {
  const navigate = useNavigate();

  return (
    <Box bg="bg.canvas">
      {/* Hero Section */}
      <Box
        bgImage={`url(${Toalla})`}
        bgPos="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        position="relative"
        minH={{ base: "500px", md: "650px", lg: "700px" }}
      >
        {/* Overlay para mejor legibilidad */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 150, 136, 0.3) 100%)"
        />

        <Container
          maxW="7xl"
          position="relative"
          zIndex={1}
          h="full"
          display="flex"
          alignItems="center"
          py={{ base: 16, md: 24 }}
        >
          <VStack
            align="flex-start"
            gap={8}
            maxW={{ base: "full", lg: "2xl" }}
            color="white"
          >
            <Heading
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="extrabold"
              lineHeight="1.1"
              textShadow="2px 2px 4px rgba(0,0,0,0.3)"
            >
              Bienestar, salud y belleza con atención personalizada
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              color="whiteAlpha.900"
              textShadow="1px 1px 2px rgba(0,0,0,0.3)"
              fontWeight="medium"
            >
              Descubre tratamientos y profesionales verificados cerca de ti.
            </Text>
            <Button
              size="xl"
              bg="brand.Cmint"
              color="brand.ink"
              _hover={{
                bg: "brand.Cblue",
                color: "white",
                transform: "scale(1.05)",
              }}
              transition="all 0.3s"
              px={12}
              py={8}
              fontSize="xl"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="xl"
            >
              <a href="/auth/login">Explorar servicios</a>
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* ¿Quiénes somos? Section */}
      <Box py={{ base: 16, md: 24, lg: 32 }} id="quienes-somos" bg="bg.canvas">
        <Container maxW="7xl">
          <VStack gap={16} align="stretch">
            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              textAlign="center"
              color="fg.default"
              fontWeight="bold"
            >
              ¿Quiénes somos?
            </Heading>

            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={12}
              alignItems="center"
            >
              {/* Texto descriptivo */}
              <VStack align="flex-start" gap={8} order={{ base: 2, lg: 1 }}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="tall"
                  color="fg.muted"
                >
                  En{" "}
                  <Text as="span" fontWeight="bold" color="brand.Cblue">
                    Vitalna
                  </Text>
                  , conectamos a personas que buscan bienestar, salud y belleza
                  con profesionales verificados y especializados.
                </Text>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="tall"
                  color="fg.muted"
                >
                  Nuestra plataforma facilita la búsqueda de servicios
                  personalizados, permitiéndote{" "}
                  <Text as="span" fontWeight="semibold">
                    reservar citas de manera rápida y segura
                  </Text>{" "}
                  con expertos en tu área.
                </Text>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="tall"
                  color="fg.muted"
                >
                  Creemos que cada persona merece acceso fácil a servicios de
                  calidad que mejoren su bienestar integral. Por eso, hemos
                  creado un espacio donde la{" "}
                  <Text as="span" fontWeight="semibold" color="brand.Cblue">
                    confianza y la profesionalidad
                  </Text>{" "}
                  se encuentran.
                </Text>
                <Button
                  size="lg"
                  colorScheme="teal"
                  variant="outline"
                  borderWidth="2px"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="semibold"
                  _hover={{ bg: "teal.50", transform: "translateY(-2px)" }}
                  transition="all 0.3s"
                >
                  <a href="/auth/login">Conocer profesionales</a>
                </Button>
              </VStack>

              {/* Imagen */}
              <Box
                order={{ base: 1, lg: 2 }}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="2xl"
                h={{ base: "350px", md: "450px", lg: "500px" }}
                position="relative"
                _hover={{ transform: "scale(1.02)" }}
                transition="transform 0.3s"
              >
                <Image
                  src={Espejo1}
                  alt="Profesional de bienestar"
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </Box>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Nuestros servicios Section */}
      <Box
        bg="bg.subtle"
        py={{ base: 16, md: 24, lg: 32 }}
        id="nuestros-servicios"
      >
        <Container maxW="7xl">
          <VStack gap={16} align="stretch">
            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              textAlign="center"
              color="fg.default"
              fontWeight="bold"
            >
              Nuestros servicios
            </Heading>

            {/* Sección SALUD */}
            <VStack gap={10} align="stretch">
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                color="brand.Cblue"
                fontWeight="bold"
                textAlign="center"
              >
                Salud
              </Heading>

              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
                {/* Medicina Familiar */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cblue",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image
                      src={MedicinaFamiliar}
                      alt="Medicina Familiar"
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Medicina Familiar
                    </Card.Title>
                  </Card.Body>
                </Card.Root>

                {/* Medicina Tecnológica */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cblue",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image
                      src={MedicinaTecnologica}
                      alt="Medicina Tecnológica"
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Medicina Tecnológica
                    </Card.Title>
                  </Card.Body>
                </Card.Root>

                {/* Nutrición */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cblue",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image
                      src={Nutricion}
                      alt="Nutrición"
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Nutrición
                    </Card.Title>
                  </Card.Body>
                </Card.Root>

                {/* Pediatría */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cblue",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image
                      src={Pediatria}
                      alt="Pediatría"
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Pediatría
                    </Card.Title>
                  </Card.Body>
                </Card.Root>
              </SimpleGrid>
            </VStack>

            {/* Sección BELLEZA */}
            <VStack gap={10} align="stretch">
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                color="brand.Cmint"
                fontWeight="bold"
                textAlign="center"
              >
                Belleza
              </Heading>

              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
                {/* Maquillaje */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cmint",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image
                      src={Maquillaje}
                      alt="Maquillaje"
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Maquillaje
                    </Card.Title>
                  </Card.Body>
                </Card.Root>

                {/* Pedicure */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cmint",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image
                      src={Pedicure}
                      alt="Pedicure"
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Pedicure
                    </Card.Title>
                  </Card.Body>
                </Card.Root>

                {/* Spa */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cmint",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image src={Spa} alt="Spa" h="full" objectFit="contain" />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Spa
                    </Card.Title>
                  </Card.Body>
                </Card.Root>

                {/* Tratamiento Facial */}
                <Card.Root
                  overflow="hidden"
                  variant="elevated"
                  bg="bg.surface"
                  _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "brand.Cmint",
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                  borderWidth="2px"
                  borderColor="transparent"
                  onClick={() => navigate("/app/services")}
                >
                  <Box
                    h="200px"
                    bg="bg.muted"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Image
                      src={TratamientoFacial}
                      alt="Tratamiento Facial"
                      h="full"
                      objectFit="contain"
                    />
                  </Box>
                  <Card.Body>
                    <Card.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.default"
                      textAlign="center"
                    >
                      Tratamiento Facial
                    </Card.Title>
                  </Card.Body>
                </Card.Root>
              </SimpleGrid>
            </VStack>

            {/* Botón Ver todos */}
            <Box textAlign="center" pt={8}>
              <Button
                size="xl"
                bg="brand.Cblue"
                color="white"
                _hover={{
                  bg: "brand.Cmint",
                  color: "brand.ink",
                  transform: "scale(1.05)",
                }}
                transition="all 0.3s"
                px={12}
                py={8}
                fontSize="xl"
                fontWeight="bold"
                borderRadius="full"
                boxShadow="xl"
              >
                <a href="/auth/login">Ver todos los servicios</a>
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box bg="brand.Cmint" py={{ base: 16, md: 20 }}>
        <Container maxW="5xl">
          <VStack gap={8} textAlign="center">
            <Heading
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              color="brand.ink"
              fontWeight="bold"
            >
              ¿Eres un profesional de la salud y belleza?
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="fg.muted"
              maxW="3xl"
            >
              Únete a nuestra plataforma y conecta con clientes que buscan tus
              servicios. Gestiona tu agenda y haz crecer tu negocio con Vitalna.
            </Text>
            <Button
              size="xl"
              bg="brand.ink"
              color="white"
              _hover={{ bg: "brand.Cblue", transform: "scale(1.05)" }}
              transition="all 0.3s"
              px={12}
              py={8}
              fontSize="xl"
              fontWeight="bold"
              borderRadius="full"
              boxShadow="xl"
            >
              <a href="/auth/register">Registrarme como profesional</a>
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
