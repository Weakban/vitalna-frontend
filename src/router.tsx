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

import ProfileView, {
  loader as profileLoader,
  action as profileAction,
} from "./views/ProfileView";

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
import { deleteAction as deleteServiceAction } from "./components/Services/ServicesDetails";
import {
  cancelAppointmentAction,
  completeAppointmentAction,
} from "./components/AppointmentDetails";
import RequestNewTokenView, {
  action as requestNewToken,
} from "./views/Auth/RequestNewTokenView";
import ForgotPasswordView from "./views/Auth/ForgotPasswordView";
import ResetPasswordView from "./views/Auth/ResetPasswordView";
import NotFoundView from "./views/NotFoundView";
import HydrateFallback from "./components/HydrateFallback";
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
    errorElement: <NotFoundView />,
    HydrateFallback,
    children: [
      { index: true, element: <HomeView /> },
      {
        path: "testing",
        element: <ForceLightOnce />,
      },
    ],
  },

  {
    path: "/app",
    element: <RequireAuth />,
    errorElement: <NotFoundView />,
    HydrateFallback,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "services",
            element: <ServicesView />,
            loader: servicesLoader,
          },
          {
            path: "account",
            element: <ProfileView />,
            loader: profileLoader,
            action: profileAction,
          },
          {
            path: "professionals",
            element: <ProfessionalsView />,
            loader: professionalsLoader,
          },
          {
            path: "appointments",
            element: <AppointmentsView />,
            loader: AppointmentsLoader,
          },
          {
            path: "appointments/:id/cancel",
            action: cancelAppointmentAction,
          },
          {
            path: "appointments/:id/complete",
            action: completeAppointmentAction,
          },
          {
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
                path: "myServices",
                element: <MyServicesView />,
                loader: myServicesLoader,
              },
              {
                path: "myLeads",
                element: <ProfessionnalLeadsView />,
                loader: professionalsLeadLoader,
              },
              {
                path: "services/:id/edit",
                element: <EditServiceView />,
                loader: editServiceLoader,
                action: editServiceAction,
              },
              {
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
    errorElement: <NotFoundView />,
    HydrateFallback,
    children: [
      {
        path: "register",
        element: <RegisterView />,
        action: newAccountAction,
      },
      {
        path: "login",
        element: <LoginView />,
        action: loginAction,
      },
      {
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
      {
        path: "forgot-password",
        element: <ForgotPasswordView />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordView />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundView />,
  },
]);

export default router;
