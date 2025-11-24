import { Box, Heading, VStack, Badge, HStack } from "@chakra-ui/react";
import { LeadCard } from "./LeadCard";
import type { LeadColumnData, LeadCardData } from "../../types/index";

interface LeadColumnProps {
  column: LeadColumnData;
  leads: LeadCardData[];
}

export const LeadColumn = ({ column, leads }: LeadColumnProps) => {
  return (
    <Box
      flex="1"
      p={4}
      bg="gray.50"
      borderRadius="md"
      borderWidth="1px"
      minW="300px"
    >
      <HStack justifyContent="space-between" mb={4}>
        <Heading size="md">{column.title}</Heading>
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
