import {
  Avatar,
  Box,
  HStack,
  Text,
  VStack,
  Badge,
  Button,
  Separator,
} from "@chakra-ui/react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";

export default function UserAvatar() {
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/app/account");
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

  // Determinar colorPalette según rol
  const getAvatarColorPalette = () => {
    return profile.role === "PROFESSIONAL" ? "brandBlue" : "brandMint";
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
          <Avatar.Root
            shape="rounded"
            size="lg"
            colorPalette={getAvatarColorPalette()}
          >
            <Avatar.Fallback name={profile.name} />
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
        <VStack gap={2} align="stretch">
          <Button
            size="sm"
            variant="outline"
            onClick={handleProfile}
            colorPalette="blue"
            justifyContent="flex-start"
          >
            <FiUser size={16} />
            Mi Perfil
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            colorPalette="red"
            justifyContent="flex-start"
          >
            <FiLogOut size={16} />
            Cerrar Sesión
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
