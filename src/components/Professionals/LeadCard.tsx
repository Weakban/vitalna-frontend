import { Box, Text, Avatar, HStack } from "@chakra-ui/react";
import type { LeadCardData } from "../../types/index"; // Asumiendo que tienes tu archivo de tipos
// Asumiendo que tienes tu archivo de tipos

interface LeadCardProps {
  lead: LeadCardData;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm" borderWidth="1px">
      <HStack>
        <Avatar.Root>
          <Avatar.Fallback name={lead.clientName} />
          <Avatar.Image />
        </Avatar.Root>
        <Box>
          <Text fontWeight="bold">{lead.clientName}</Text>
          <Text fontSize="sm" color="gray.500">
            {lead.service}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};
