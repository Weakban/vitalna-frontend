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
          placeholder="Introduce el nombre del servicio"
          {...register("name", {
            required: "El nombre del servicio es obligatorio",
          })}
        />

        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.price}>
        <Field.Label>Precio en pesos mexicanos</Field.Label>
        <Input
          id="price"
          type="number"
          placeholder="Introduce el precio del servicio"
          {...register("price", {
            required: "El precio es obligatorio",
          })}
        />
        <Field.ErrorText>{errors.price?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.durationMin}>
        <Field.Label>Duración en minutos</Field.Label>
        <Input
          id="durationMin"
          type="number"
          placeholder="Introduce la duración en minutos"
          {...register("durationMin", {
            required: "La duración es obligatoria",
          })}
        />
        <Field.ErrorText>{errors.durationMin?.message}</Field.ErrorText>
      </Field.Root>

      <Field.Root invalid={!!errors.description}>
        <Field.Label>Descripción del servicio</Field.Label>
        <Input
          id="description"
          placeholder="Describe los detalles del servicio"
          {...register("description", {
            required: "La descripción es obligatoria",
          })}
        />
        <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
      </Field.Root>
    </Stack>
  );
}
