import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useAuthStore } from "@/store/auth";

export default function NotFoundView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, profile } = useAuthStore();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("brand.ink", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.Cblue", "brand.Cmint");

  const handleGoHome = () => {
    if (isAuth) {
      // Si está autenticado, redirigir según rol
      if (profile?.role === "PROFESSIONAL") {
        navigate("/app/appointments");
      } else {
        navigate("/app/services");
      }
    } else {
      // Si no está autenticado, ir al inicio
      navigate("/");
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" py={12}>
      <Container maxW="2xl">
        <VStack gap={8} textAlign="center">
          {/* 404 Grande */}
          <Box>
            <Text
              fontSize={{ base: "120px", md: "180px" }}
              fontWeight="extrabold"
              color={accentColor}
              lineHeight="1"
              letterSpacing="tight"
            >
              404
            </Text>
            <Box
              h="4px"
              w="120px"
              bg={accentColor}
              mx="auto"
              borderRadius="full"
              mt={-4}
            />
          </Box>

          {/* Contenido principal */}
          <Box
            bg={cardBg}
            p={{ base: 8, md: 10 }}
            borderRadius="2xl"
            shadow="xl"
            w="full"
            borderTop="4px solid"
            borderColor={accentColor}
          >
            <VStack gap={6}>
              <Box>
                <Heading
                  size={{ base: "lg", md: "xl" }}
                  color={headingColor}
                  mb={3}
                >
                  Página no encontrada
                </Heading>
                <Text
                  color={textColor}
                  fontSize={{ base: "md", md: "lg" }}
                  maxW="md"
                  mx="auto"
                >
                  Lo sentimos, la página que buscas no existe o no tienes
                  permisos para acceder a ella.
                </Text>
              </Box>

              {/* Ruta solicitada */}
              <Box
                bg={useColorModeValue("gray.100", "gray.700")}
                px={4}
                py={3}
                borderRadius="lg"
                w="full"
                maxW="md"
              >
                <Text
                  fontSize="xs"
                  color={textColor}
                  fontWeight="medium"
                  mb={1}
                >
                  Ruta solicitada:
                </Text>
                <Text
                  fontSize="sm"
                  color={accentColor}
                  fontFamily="mono"
                  wordBreak="break-all"
                >
                  {location.pathname}
                </Text>
              </Box>

              {/* Sugerencias */}
              <Box w="full" maxW="md">
                <Text
                  fontSize="sm"
                  color={textColor}
                  mb={3}
                  fontWeight="semibold"
                >
                  Posibles razones:
                </Text>
                <VStack gap={2} align="start">
                  <Text fontSize="sm" color={textColor}>
                    • La página fue movida o eliminada
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    • El enlace está roto o mal escrito
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    • No tienes permisos para acceder
                  </Text>
                </VStack>
              </Box>

              {/* Botones de acción */}
              <VStack gap={3} w="full" mt={4}>
                <Button
                  size="lg"
                  w="full"
                  maxW="sm"
                  bg={accentColor}
                  color="white"
                  fontWeight="semibold"
                  onClick={handleGoHome}
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "lg",
                    bg: useColorModeValue("brand.ink", "brand.Cblue"),
                  }}
                  transition="all 0.2s"
                >
                  {isAuth ? "Ir a inicio" : "Ir a página principal"}
                </Button>

                <Button
                  size="lg"
                  w="full"
                  maxW="sm"
                  variant="outline"
                  borderColor={accentColor}
                  color={accentColor}
                  fontWeight="semibold"
                  onClick={handleGoBack}
                  _hover={{
                    bg: accentColor,
                    color: "white",
                  }}
                  transition="all 0.2s"
                >
                  ← Volver atrás
                </Button>
              </VStack>
            </VStack>
          </Box>

          {/* Footer con ayuda */}
          <Box>
            <Text fontSize="sm" color={textColor}>
              ¿Necesitas ayuda?{" "}
              <Text
                as="span"
                color={accentColor}
                fontWeight="semibold"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => navigate("/")}
              >
                Contacta con soporte
              </Text>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
