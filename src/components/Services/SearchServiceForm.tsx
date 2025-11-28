import {
  Card,
  createListCollection,
  HStack,
  Input,
  Portal,
  Select,
} from "@chakra-ui/react";

import { FiSearch } from "react-icons/fi";

type SearchServiceFormProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
};

export default function SearchServiceForm({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
}: SearchServiceFormProps) {
  const categories = createListCollection({
    items: [
      { label: "Todas las categorías", value: "ALL" },
      { label: "Salud", value: "HEALTH" },
      { label: "Belleza", value: "BEAUTY" },
    ],
  });

  const sortOptions = createListCollection({
    items: [
      { label: "Más recientes", value: "newest" },
      { label: "Nombre (A-Z)", value: "name-asc" },
      { label: "Nombre (Z-A)", value: "name-desc" },
      { label: "Precio: Menor a Mayor", value: "price-asc" },
      { label: "Precio: Mayor a Menor", value: "price-desc" },
    ],
  });

  return (
    <>
      {/* Filtros / búsqueda */}
      <Card.Root mb={5} p={4} borderWidth="1px" rounded="2xl">
        <HStack gap={3} align="stretch" flexWrap="wrap">
          <HStack flex="1" minW={{ base: "full", md: "300px" }}>
            <FiSearch size={20} />
            <Input
              placeholder="Buscar por nombre, descripción…"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </HStack>

          <Select.Root
            collection={categories}
            size="sm"
            width={{ base: "full", md: "240px" }}
            value={[selectedCategory]}
            onValueChange={(e) => onCategoryChange(e.value[0])}
          >
            <Select.Label>Categoría</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Seleccionar categoría" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {categories.items.map((category: any) => (
                    <Select.Item item={category} key={category.value}>
                      {category.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root
            collection={sortOptions}
            size="sm"
            width={{ base: "full", md: "240px" }}
            value={[selectedSort]}
            onValueChange={(e) => onSortChange(e.value[0])}
          >
            <Select.Label>Ordenar por</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Seleccionar orden" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {sortOptions.items.map((option: any) => (
                    <Select.Item item={option} key={option.value}>
                      {option.label}
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
