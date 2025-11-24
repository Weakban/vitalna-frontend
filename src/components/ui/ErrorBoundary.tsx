import React from "react";
import { Box, VStack, HStack, Heading, Text, Button } from "@chakra-ui/react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <Box p={8} maxWidth="500px" mx="auto" textAlign="center">
          <VStack gap={4}>
            <Heading size="lg" color="red.500">
              ¡Oops! Algo salió mal
            </Heading>
            <Text color="gray.600">
              Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
            </Text>
            {this.state.error && (
              <Text fontSize="sm" color="gray.500" fontFamily="mono">
                {this.state.error.message}
              </Text>
            )}
            <Button onClick={this.resetError} colorScheme="blue">
              Intentar de nuevo
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Componente de fallback personalizado para errores de profesionales
export function ProfessionalErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <Box p={{ base: 4, md: 8 }} maxWidth="900px" mx="auto">
      <VStack gap={4} textAlign="center">
        <Heading size="lg" color="red.500">
          Error al cargar el perfil
        </Heading>
        <Text color="gray.600">
          No se pudo cargar la información del profesional.
        </Text>
        {error && (
          <Text fontSize="sm" color="gray.500" fontFamily="mono">
            {error.message}
          </Text>
        )}
        <HStack gap={2}>
          <Button onClick={resetError} colorScheme="blue">
            Reintentar
          </Button>
          <Button
            onClick={() => (window.location.href = "/app/professionals")}
            variant="outline"
          >
            Volver a profesionales
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
