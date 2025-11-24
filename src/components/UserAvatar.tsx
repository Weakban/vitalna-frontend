import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Badge,
  IconButton,
  Separator,
} from "@chakra-ui/react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "./ui/tooltip";

export default function UserAvatar() {
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/account");
  };

  const getRoleBadge = () => {
    if (profile.role === "PROFESSIONAL") {
      return (
        <Badge
          colorPalette="purple"
          variant="solid"
          size="sm"
          bg="brand.Cblue"
          color="white"
        >
          Profesional
        </Badge>
      );
    }
    return (
      <Badge
        colorPalette="blue"
        variant="solid"
        size="sm"
        bg="brand.Cmint"
        color="brand.ink"
      >
        Cliente
      </Badge>
    );
  };

  return (
    <Box
      px={3}
      py={3}
      borderRadius="lg"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border.default"
    >
      <VStack gap={3} align="stretch">
        {/* User Info */}
        <HStack gap={3} align="center">
          <Avatar.Root shape="rounded" size="lg" bg="brand.Cblue">
            <Avatar.Fallback name={profile.name} color="white" />
          </Avatar.Root>

          <VStack flex="1" align="flex-start" gap={1} minW={0}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              lineClamp={1}
              color="fg.default"
            >
              {profile.name}
            </Text>
            {profile.role && getRoleBadge()}
          </VStack>
        </HStack>

        <Separator />

        {/* Action Buttons */}
        <HStack gap={2} justify="space-around">
          <Tooltip content="Mi Perfil">
            <IconButton
              aria-label="Mi Perfil"
              size="sm"
              variant="ghost"
              onClick={handleProfile}
              color="brand.Cblue"
              _hover={{ bg: "brand.Cmint" }}
            >
              <FiUser size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip content="Cerrar Sesión">
            <IconButton
              aria-label="Cerrar Sesión"
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              color="red.500"
              _hover={{ bg: "red.50" }}
            >
              <FiLogOut size={18} />
            </IconButton>
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  );
}
