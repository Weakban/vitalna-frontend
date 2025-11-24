// src/router/professionalScheduleRoute.tsx
// Configuración de ruta para el componente ProfessionalScheduleView

import type { RouteObject } from "react-router-dom";
import ProfessionalScheduleView, {
  loader,
  action,
} from "@/views/Professionals/ProfessionalScheduleView";

export const professionalScheduleRoute: RouteObject = {
  path: "/app/professionals/schedule",
  element: <ProfessionalScheduleView />,
  loader,
  action,
  // Opcional: configuración adicional
  errorElement: <div>Error al cargar la página de horarios</div>,
};

// Ejemplo de cómo integrar en el router principal:
/*
import { createBrowserRouter } from 'react-router-dom';
import { professionalScheduleRoute } from './professionalScheduleRoute';

const router = createBrowserRouter([
  {
    path: '/app',
    element: <AppLayout />, // Tu layout principal
    children: [
      professionalScheduleRoute,
      // otras rutas...
    ]
  }
]);
*/
