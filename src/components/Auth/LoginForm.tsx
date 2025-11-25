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
    <Stack
      gap="5"
      align="flex-start"
      w="full"
      maxW={{ base: "full", sm: "sm" }}
    >
      <Field.Root invalid={!!errors.email} w="full">
        <Field.Label fontWeight="medium" mb={2}>
          Correo electrónico
        </Field.Label>
        <Input
          id="email"
          data-testid="email-input"
          type="email"
          placeholder="ejemplo@correo.com"
          size="lg"
          {...register("email", {
            required: "El correo electrónico es obligatorio",
          })}
        />
        <Field.ErrorText mt={1.5}>{errors.email?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.password} w="full">
        <Field.Label fontWeight="medium" mb={2}>
          Contraseña
        </Field.Label>
        <PasswordInput
          id="password"
          data-testid="password-input"
          placeholder="Tu contraseña"
          size="lg"
          {...register("password", {
            required: "La contraseña es obligatoria",
          })}
        />
        <Field.ErrorText mt={1.5}>{errors.password?.message}</Field.ErrorText>
      </Field.Root>
    </Stack>
  );
}
