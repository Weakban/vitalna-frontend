import {
  Card,
  createListCollection,
  HStack,
  Input,
  Portal,
  Select,
} from "@chakra-ui/react";

import { FiSearch } from "react-icons/fi";

export default function SearchServiceForm() {
  const frameworks = createListCollection({
    items: [
      { label: "SALUD", value: "HELATH" },
      { label: "BELLEZA", value: "BEAUTY" },
    ],
  });
  return (
    <>
      {/* Filtros / búsqueda */}
      <Card.Root mb={5} p={4} borderWidth="1px" rounded="2xl">
        <HStack gap={3} align="stretch" flexWrap="wrap">
          <FiSearch />
          <Input placeholder="Buscar por nombre, categoría…" />

          <Select.Root collection={frameworks} size="sm" width="320px">
            <Select.HiddenSelect />
            <Select.Label>Categoría</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select framework" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {frameworks.items.map((framework: any) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root collection={frameworks} size="sm" width="320px">
            <Select.HiddenSelect />
            <Select.Label>Ordenar por..</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select framework" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {frameworks.items.map((framework: any) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </HStack>
      </Card.Root>
    </>
  );
}
