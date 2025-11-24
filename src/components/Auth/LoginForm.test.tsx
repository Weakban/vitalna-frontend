// src/components/Auth/LoginForm.test.tsx
//
// Archivo de pruebas para el componente `LoginForm`.
// Contiene dos pruebas que verifican la validación del formulario:
//  - que el campo email sea requerido
//  - que el campo contraseña sea requerido
//
// La estrategia usada es envolver el componente con un pequeño formulario
// real (react-hook-form) para que se ejecute la lógica de validación
// definida dentro de `LoginForm`. Además se envuelve con `ChakraProvider`
// (usando el `system` del proyecto) y `MemoryRouter` para reproducir
// el contexto visual y de routing necesario.
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import LoginForm from "./LoginForm";
import { system } from "../../themes/system";

// Helper: envoltorio mínimo que proporciona un contexto real de
// `react-hook-form` y un botón de submit. Esto permite que las reglas
// de validación definidas en `LoginForm` se ejecuten al enviar el formulario.
function FormWrapper() {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <LoginForm register={register} errors={formState.errors} />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

describe("Componente: LoginForm", () => {
  // Prueba 1: enviar el formulario sin completar el email debe mostrar
  // el mensaje de validación definido en el propio componente.
  it("muestra error de campo requerido para email vacío al enviar", async () => {
    render(
      <ChakraProvider value={system}>
        <MemoryRouter>
          <FormWrapper />
        </MemoryRouter>
      </ChakraProvider>
    );

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/el correo electrónico es obligatorio/i)
      ).toBeInTheDocument();
    });
  });

  // Prueba 2: completar el email pero dejar la contraseña vacía debe
  // mostrar el mensaje de contraseña requerida.
  it("muestra error de contraseña requerida cuando la contraseña está vacía", async () => {
    render(
      <ChakraProvider value={system}>
        <MemoryRouter>
          <FormWrapper />
        </MemoryRouter>
      </ChakraProvider>
    );

    const emailInput = screen.getByTestId("email-input");
    await userEvent.type(emailInput, "elena.rios@nutricion.com");

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/la contraseña es obligatoria/i)
      ).toBeInTheDocument();
    });
  });
});
