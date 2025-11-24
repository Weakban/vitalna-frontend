import { Input, Stack, Field, SegmentGroup } from "@chakra-ui/react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import type { Service, serviceFormData } from "@/types";

type NewServiceFormProps = {
  register: UseFormRegister<serviceFormData>;
  errors: FieldErrors<serviceFormData>;
  control: Control<serviceFormData>;
  service?: Service;
};

export default function RegisterForm({
  errors,
  register,
  control,
}: NewServiceFormProps) {
  const CATEGORY_ITEMS = [
    { label: "Salud", value: "1" },
    { label: "Belleza", value: "2" },
  ];

  const availabilityOptions = [
    { label: "Disponible", value: "true" },
    { label: "No disponible", value: "false" },
  ];

  return (
    <Stack gap="4" align="flex-start" maxW="sm">
      <Controller
        control={control}
        name="CategoryId"
        rules={{ required: "La categoría es obligatoria" }}
        render={({ field }) => (
          <Field.Root invalid={!!errors.CategoryId}>
            <Field.Label>Categoría del servicio</Field.Label>
            <SegmentGroup.Root
              size="sm"
              onBlur={field.onBlur}
              name={field.name}
              value={field.value ? String(field.value) : ""}
              onValueChange={({ value }) => field.onChange(Number(value))}
            >
              <SegmentGroup.Items items={CATEGORY_ITEMS} />
              <SegmentGroup.Indicator />
            </SegmentGroup.Root>
            <Field.ErrorText>{errors.CategoryId?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />

      <Field.Root invalid={!!errors.name}>
        <Field.Label>Nombre del servicio</Field.Label>
        <Input
          id="name"
          placeholder="Introduce tu nombre completo"
          {...register("name", {
            required: "El nombre es obligatorio",
          })}
        />

        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.price}>
        <Field.Label>Precio en pesos mexicanos</Field.Label>
        <Input
          id="price"
          placeholder="Introduce tu correo electrónico "
          {...register("price", {
            required: "El correo electrónico es obligatorio",
          })}
        />
        <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.durationMin}>
        <Field.Label>Duración en minutos</Field.Label>
        <Input
          id="durationMin"
          placeholder="Introduce tu correo electrónico "
          {...register("durationMin", {
            required: "El correo electrónico es obligatorio",
          })}
        />
        <Field.ErrorText>{errors.durationMin?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.description}>
        <Field.Label>Introduce una descripcion del servicio</Field.Label>
        <Input
          id="description"
          placeholder="Introduce tu correo electrónico "
          {...register("description", {
            required: "El correo electrónico es obligatorio",
          })}
        />
        <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
      </Field.Root>

      <Controller
        control={control}
        name="isActive"
        render={({ field }) => (
          <Field.Root invalid={!!errors.isActive}>
            <Field.Label>Categoría del servicio</Field.Label>
            <SegmentGroup.Root
              size="sm"
              onBlur={field.onBlur}
              name={field.name}
              //value={field.value}
              onValueChange={({ value }) => field.onChange(value)}
            >
              <SegmentGroup.Items items={availabilityOptions} />
              <SegmentGroup.Indicator />
            </SegmentGroup.Root>
            <Field.ErrorText>{errors.isActive?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
    </Stack>
  );
}
