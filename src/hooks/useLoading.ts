import { useState, useEffect } from "react";

/**
 * Hook personalizado para manejar estados de carga con timeout
 * Útil para operaciones que pueden tardar (como consultas a Odoo)
 */
export function useLoadingWithTimeout(
  initialLoading = false,
  timeoutMs = 1000
) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [showLoadingUI, setShowLoadingUI] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // Mostrar loading UI después del timeout especificado
      timeoutId = setTimeout(() => {
        setShowLoadingUI(true);
      }, timeoutMs);
    } else {
      // Ocultar inmediatamente cuando termina la carga
      setShowLoadingUI(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, timeoutMs]);

  return {
    isLoading,
    showLoadingUI,
    setLoading: setIsLoading,
  };
}

/**
 * Hook para manejar el estado de carga de datos de profesionales
 */
export function useProfessionalLoading() {
  const [isLoadingProfessional, setIsLoadingProfessional] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const { showLoadingUI } = useLoadingWithTimeout(
    isLoadingProfessional || isLoadingServices,
    500 // Mostrar loading después de 500ms
  );

  const setAllLoaded = () => {
    setIsLoadingProfessional(false);
    setIsLoadingServices(false);
  };

  return {
    isLoadingProfessional,
    isLoadingServices,
    showLoadingUI,
    setIsLoadingProfessional,
    setIsLoadingServices,
    setAllLoaded,
    isAnyLoading: isLoadingProfessional || isLoadingServices,
  };
}
