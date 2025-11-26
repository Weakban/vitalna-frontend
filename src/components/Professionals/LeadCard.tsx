import { Box, Text, Avatar, HStack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { LeadCardData } from "../../types/index"; // Asumiendo que tienes tu archivo de tipos
// Asumiendo que tienes tu archivo de tipos

interface LeadCardProps {
  lead: LeadCardData;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textMuted = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <HStack>
        <Avatar.Root>
          <Avatar.Fallback name={lead.clientName} />
          <Avatar.Image />
        </Avatar.Root>
        <Box>
          <Text fontWeight="bold">{lead.clientName}</Text>
          <Text fontSize="sm" color={textMuted}>
            {lead.service}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};
