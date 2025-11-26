import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Provider } from "@/components/ui/provider";
import { CustomColorProvider } from "./context/CustomColorProvider";

// Componente de fallback general para la aplicación (sin Chakra UI)
function AppLoadingFallback() {
  return (
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
          width: "50px",
          height: "50px",
          border: "4px solid #e2e8f0",
          borderTop: "4px solid #3182ce",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ color: "#4a5568", margin: 0, fontSize: "16px" }}>
        Cargando aplicación...
      </p>
      <p style={{ color: "#718096", margin: 0, fontSize: "14px" }}>
        Conectando con los servicios...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider defaultTheme="light">
      <CustomColorProvider>
        <Suspense fallback={<AppLoadingFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </CustomColorProvider>
    </Provider>
  </StrictMode>
);
