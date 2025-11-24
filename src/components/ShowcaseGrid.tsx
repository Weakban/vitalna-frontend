import { SimpleGrid, Box, Image } from "@chakra-ui/react";
type Item = { src: string; alt?: string };

export default function ShowcaseGrid({ items }: { items: Item[] }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} py={{ base: 6, md: 10 }}>
      {items.map((it, idx) => (
        <Box key={idx} overflow="hidden" rounded="xl">
          <Image
            src={it.src}
            alt={it.alt || ""}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}
