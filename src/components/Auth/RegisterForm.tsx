import { Input, Stack, Field, SegmentGroup } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { RegisterFormData } from "@/types";

type RegisterFormProps = {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  control: Control<RegisterFormData>;
};

export default function RegisterForm({
  errors,
  register,
  control,
}: RegisterFormProps) {
  const ROLE_ITEMS = [
    { label: "Cliente", value: "CLIENT" },
    { label: "Profesional", value: "PROFESSIONAL" },
  ];

  const role = useWatch({ control, name: "role" });

  return (
    <Stack
      gap="4"
      align="flex-start"
      w="full"
      maxW={{ base: "full", sm: "sm" }}
    >
      <Controller
        control={control}
        name="role"
        rules={{ required: "La categoría es obligatoria" }}
        render={({ field }) => (
          <Field.Root invalid={!!errors.role}>
            <Field.Label>Tipo de cuenta</Field.Label>
            <SegmentGroup.Root
              size="sm"
              onBlur={field.onBlur}
              name={field.name}
              value={field.value ? String(field.value) : ""}
              onValueChange={({ value }) => field.onChange(value)}
            >
              <SegmentGroup.Items items={ROLE_ITEMS} />
              <SegmentGroup.Indicator />
            </SegmentGroup.Root>
            <Field.ErrorText>{errors.role?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />

      <Field.Root invalid={!!errors.name}>
        <Field.Label>Nombre de usuario</Field.Label>
        <Input
          id="name"
          placeholder="Introduce tu nombre completo"
          {...register("name", {
            required: "El nombre es obligatorio",
          })}
        />
        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.email}>
        <Field.Label>Correo electrónico</Field.Label>
        <Input
          id="email"
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
          placeholder="Introduce la contraseña"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: { value: 8, message: "Minimo 8 caracteres" },
          })}
        />
        <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.password_confirmation}>
        <Field.Label>Confirma tu contraseña</Field.Label>
        <PasswordInput
          id="password_confirmation"
          placeholder="Introduce la contraseña"
          {...register("password_confirmation", {
            required: "Es necesario confirmar la contraseña",
            minLength: { value: 8, message: "Minimo 8 caracteres" },
          })}
        />
        <Field.ErrorText>
          {errors.password_confirmation?.message}
        </Field.ErrorText>
      </Field.Root>

      {/* Fragmento para CLIENT */}

      {role === "CLIENT" && (
        <Stack
          gap="4"
          align="flex-start"
          w="full"
          maxW={{ base: "full", sm: "sm" }}
        >
          <Field.Root invalid={!!errors.phone}>
            <Field.Label>Número de teléfono</Field.Label>
            <Input
              id="phone"
              placeholder="introduce tu numero telefónico "
              {...register("phone", {
                required: "El número de teléfono es obligatorio",
              })}
            />
            <Field.ErrorText>{errors.specialty?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.gender}>
            <Field.Label>Genero</Field.Label>
            <Input
              id="gender"
              placeholder="Especifica tu genero "
              {...register("gender", {
                required: "La especialidad es obligatoria",
              })}
            />
            <Field.ErrorText>{errors.gender?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.birthDate}>
            <Field.Label>Fecha de cumpleaños</Field.Label>
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate", {
                required: "La biografía es obligatoria",
              })}
            />
            <Field.ErrorText>{errors.birthDate?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>
      )}

      {role === "PROFESSIONAL" && (
        <Stack
          gap="4"
          align="flex-start"
          w="full"
          maxW={{ base: "full", sm: "sm" }}
        >
          <Field.Root invalid={!!errors.phone}>
            <Field.Label>Número de teléfono</Field.Label>
            <Input
              id="phone"
              placeholder="introduce tu numero telefónico "
              {...register("phone", {
                required: "El número de teléfono es obligatorio",
              })}
            />
            <Field.ErrorText>{errors.specialty?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.specialty}>
            <Field.Label>Especialidad</Field.Label>
            <Input
              id="specialty"
              placeholder="introduce tu numero telefónico "
              {...register("specialty", {
                required: "La especialidad es obligatoria",
              })}
            />
            <Field.ErrorText>{errors.specialty?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.bio}>
            <Field.Label>Biografía</Field.Label>
            <Input
              id="bio"
              placeholder="introduce tu numero telefónico "
              {...register("bio", {
                required: "La biografía es obligatoria",
              })}
            />
            <Field.ErrorText>{errors.bio?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>
      )}
    </Stack>
  );
}
