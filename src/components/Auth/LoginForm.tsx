import { Field, Input, Stack } from "@chakra-ui/react";
import { PasswordInput } from "../ui/password-input";
import type { LoginFormData } from "@/types";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type LoginFormProps = {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  //reset: UseFormReset<LoginFormData>
};

export default function LoginForm({ errors, register }: LoginFormProps) {
  return (
    <Stack gap="4" align="flex-start" maxW="sm">
      <Field.Root invalid={!!errors.email}>
        <Field.Label>Correo electrónico</Field.Label>
        <Input
          id="email"
          data-testid="email-input"
          placeholder="Introduce tu correo electrónico "
          {...register("email", {
            required: "El correo electrónico es obligatorio",
          })}
        />
        <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.password}>
        <Field.Label>Contraseña</Field.Label>
        <PasswordInput
          id="password"
          data-testid="password-input"
          placeholder="Introduce la contraseña"
          {...register("password", {
            required: "La contraseña es obligatoria",
          })}
        />
        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
      </Field.Root>
    </Stack>
  );
}
