import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import RegisterView, {
  action as newAccountAction,
} from "./views/Auth/RegisterView";
import CreateServiceView, {
  action as newServiceAction,
} from "./views/Services/CreateServiceView";

import ServicesView, {
  loader as servicesLoader,
} from "./views/Services/ServicesView";
import MyServicesView, {
  loader as myServicesLoader,
} from "./views/Services/MyServicesView";

import ConfirmAccountView, {
  action as confirmAction,
} from "./views/Auth/ConfirmAccountView";
import LoginView, { action as loginAction } from "./views/Auth/LoginView";
import AuthLayout from "./layouts/AuthLayout";
import HomeView from "./views/HomeView";
import EditServiceView, {
  loader as editServiceLoader,
  action as editServiceAction,
} from "./views/Services/EditServiceView";
import { ForceLightOnce } from "./views/ViewsTesting";
import { delteAction as deleteServiceAction } from "./components/Services/ServicesDetails";
import RequestNewTokenView, {
  action as requestNewToken,
} from "./views/Auth/RequestNewTokenView";
import PrivateLayout from "./layouts/PrivateLayout";
import { RequireAuth } from "./components/Auth/RequireAuth";
import { IsProfessional } from "./components/Auth/isProfessional";

import ProfessionalsView, {
  loader as professionalsLoader,
} from "./views/Professionals/ProfessionalsView";

import ProfessionnalLeadsView, {
  loader as professionalsLeadLoader,
} from "./views/Professionals/ProfessionnalLeadsView";

import ProfessionalInfoView, {
  loader as professionalInfoLoader,
} from "./views/Professionals/ProfessionalInfoView";
import BookingView, {
  loader as bookingLoader,
  action as bookingAction,
} from "./views/Services/BookingView";
import ProfessionalScheduleView, {
  loader as scheduleLoader,
  action as scheduleAction,
} from "./views/Professionals/ProfessionalScheduleView";
import AppointmentsView, {
  loader as AppointmentsLoader,
} from "./views/AppointmentsView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomeView /> },

      {
        //visual testing
        path: "testing",
        element: <ForceLightOnce />,
      },
    ],
  },

  {
    path: "/app",
    element: <RequireAuth />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            //Mostrar servicios
            path: "services",
            element: <ServicesView />,
            loader: servicesLoader,
          },
          {
            //Mostrar servicios
            path: "professionals",
            element: <ProfessionalsView />,
            loader: professionalsLoader,
          },
          {
            //Mostrar servicios
            path: "appointments",
            element: <AppointmentsView />,
            loader: AppointmentsLoader,
          },

          {
            //Mostrar Información de un profesional
            path: "professionalInfo/:id",
            element: <ProfessionalInfoView />,
            loader: professionalInfoLoader,
            HydrateFallback: () => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "100vh",
                  backgroundColor: "#f7fafc",
                  fontFamily: "system-ui, sans-serif",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #e2e8f0",
                    borderTop: "4px solid #3182ce",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p style={{ color: "#4a5568", margin: 0 }}>
                  Cargando perfil del profesional...
                </p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ),
          },
          {
            //Agendar servicio
            path: "booking/:id",
            element: <BookingView />,
            loader: bookingLoader,
            action: bookingAction,
          },

          {
            path: "professional",
            element: <IsProfessional />,
            children: [
              {
                //Mostrar servicios
                path: "myServices",
                element: <MyServicesView />,
                loader: myServicesLoader,
              },

              {
                //Mostrar servicios
                path: "myLeads",
                element: <ProfessionnalLeadsView />,
                loader: professionalsLeadLoader,
              },
              {
                //Editar servicios
                path: "services/:id/edit", //ROA pattern - Resource-oriented design
                element: <EditServiceView />,
                loader: editServiceLoader,
                action: editServiceAction,
              },

              {
                //delete
                path: "services/:id/delete",
                action: deleteServiceAction,
              },
              {
                path: "create-service",
                element: <CreateServiceView />,
                action: newServiceAction,
              },

              {
                path: "schedule",
                element: <ProfessionalScheduleView />,
                loader: scheduleLoader,
                action: scheduleAction,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "register",
        element: <RegisterView />,
        action: newAccountAction,
      },

      { path: "login", element: <LoginView />, action: loginAction },
      {
        //visual testing
        path: "testing",
        element: <ForceLightOnce />,
      },

      {
        path: "confirm-account",
        element: <ConfirmAccountView />,
        action: confirmAction,
      },
      {
        path: "request-code",
        element: <RequestNewTokenView />,
        action: requestNewToken,
      },
    ],
  },
]);

export default router;
