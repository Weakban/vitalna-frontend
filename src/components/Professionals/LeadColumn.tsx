import { Box, Heading, VStack, Badge, HStack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { LeadCard } from "./LeadCard";
import type { LeadColumnData, LeadCardData } from "../../types/index";

interface LeadColumnProps {
  column: LeadColumnData;
  leads: LeadCardData[];
}

export const LeadColumn = ({ column, leads }: LeadColumnProps) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("fg.default", "white");

  return (
    <Box
      flex="1"
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      minW="300px"
    >
      <HStack justifyContent="space-between" mb={4}>
        <Heading size="md" color={headingColor}>
          {column.title}
        </Heading>
        <Badge colorScheme="purple" borderRadius="full" px={2}>
          {leads.length}
        </Badge>
      </HStack>
      <VStack gap={4} align="stretch">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </VStack>
    </Box>
  );
};
