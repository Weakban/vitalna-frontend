import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export const IsProfessional = () => {
  const profile = useAuthStore((state) => state.profile);
  if (profile.role === "PROFESSIONAL") {
    return <Outlet />;
  }
  return <Navigate to="/app/services" />;
};
