// src/components/layout/Sidebar.tsx
import {
  Box,
  Text,
  IconButton,
  Image,
  Flex,
  Icon,
  type FlexProps,
  Separator,
} from "@chakra-ui/react";
import { useColorModeValue, ColorModeButton } from "./ui/color-mode";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdOutlineMedicalServices } from "react-icons/md";
import { LuMessageSquareText } from "react-icons/lu";
import { BsKanban } from "react-icons/bs";
import UserAvatar from "./UserAvatar";
import vitalna from "../assets/Vitalna.svg";
import { useState } from "react";
import type { IconType } from "react-icons/lib";
import { useAuthStore } from "@/store/auth";

type UserRole = "PROFESSIONAL" | "CLIENT";

interface LinkItemProps {
  name: string;
  path: string;
  icon: IconType;
  roles?: UserRole[];
}

export const LinkItems: Array<LinkItemProps> = [
  {
    name: "Profesionales",
    path: "/app/professionals",
    icon: FiUsers,
    roles: ["CLIENT"],
  },
  {
    name: "Servicios",
    path: "/app/services",
    icon: FiBriefcase,
    roles: ["CLIENT"],
  },
  /*
  {
    name: "Promociones y ofertas",
    path: "/promociones_y_ofertas",
    icon: LuHandCoins,
  },*/
  {
    name: "Mis citas",
    path: "/app/appointments",
    icon: LuMessageSquareText,
  },
  {
    name: "Mis Servicios",
    path: "/app/professional/myServices",
    icon: MdOutlineMedicalServices,
    roles: ["PROFESSIONAL"],
  },
  {
    name: "Mi actividad",
    path: "/app/professional/myLeads",
    icon: BsKanban,
    roles: ["PROFESSIONAL"],
  },
  {
    name: "Mi Agenda",
    path: "/app/professional/schedule",
    icon: FiCalendar,
    roles: ["PROFESSIONAL"],
  },
];

export default function Sidebar() {
  const bg = useColorModeValue("white", "gray.900");
  const border = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.800");

  const [isOpen, setIsOpen] = useState(true);
  const profile = useAuthStore((state) => state.profile);

  const handleNavItemClick = () => {
    setIsOpen(false);
  };

  return (
    <Box
      as="aside"
      bg={bg}
      borderRightWidth="1px"
      borderColor={border}
      w={isOpen ? "280px" : "0px"}
      h="100vh"
      position="sticky"
      top={0}
      transition="width 0.3s ease"
      overflow="visible"
      boxShadow={isOpen ? "lg" : "none"}
      zIndex={10}
    >
      {isOpen && (
        <Flex direction="column" h="100%" justify="space-between">
          {/* Header */}
          <Box bg={headerBg} w="full" py={8} px={6} boxShadow="sm">
            <Flex direction="column" gap={4}>
              <Flex justify="center" align="center">
                <Image
                  alt="Vitalna Logo"
                  objectFit="contain"
                  src={vitalna}
                  maxH="70px"
                  w="auto"
                />
              </Flex>

              <Flex justify="center">
                <ColorModeButton size="sm" />
              </Flex>
            </Flex>
          </Box>

          <Separator />

          {/* Body */}
          <Box flex="1" overflowY="auto" py={4}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={useColorModeValue("gray.500", "gray.400")}
              textTransform="uppercase"
              letterSpacing="wider"
              px={6}
              mb={4}
            >
              Navegación
            </Text>

            <Flex direction="column" gap={1} px={3}>
              {LinkItems.filter((link) => {
                return !link.roles || link.roles.includes(profile.role);
              }).map((link) => (
                <NavItem
                  key={link.name}
                  icon={link.icon}
                  path={link.path}
                  name={link.name}
                  onNavigate={handleNavItemClick}
                />
              ))}
            </Flex>
          </Box>

          <Separator />

          {/* Footer */}
          <Box py={4} px={3}>
            <UserAvatar />
          </Box>
        </Flex>
      )}

      {/* Toggle Button */}
      <IconButton
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setIsOpen(!isOpen)}
        size="md"
        position="fixed"
        top="50%"
        left={isOpen ? "268px" : "0px"}
        transform="translateY(-50%)"
        borderRadius="0 8px 8px 0"
        zIndex={10000}
        colorScheme="cyan"
        boxShadow="xl"
        bg="cyan.500"
        color="white"
        px={2}
        _hover={{
          transform: "translateY(-50%) scale(1.05)",
          boxShadow: "2xl",
          bg: "cyan.600",
        }}
        transition="all 0.3s ease"
      >
        {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </IconButton>
    </Box>
  );
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  name: string;
  path: string;
  onNavigate?: () => void;
}

const NavItem = ({ icon, name, path, onNavigate, ...rest }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  const activeBg = useColorModeValue("cyan.50", "cyan.900");
  const activeColor = useColorModeValue("cyan.700", "cyan.200");
  const inactiveColor = useColorModeValue("gray.700", "gray.300");
  const hoverBg = useColorModeValue(
    isActive ? "cyan.100" : "gray.100",
    isActive ? "cyan.800" : "gray.700"
  );
  const hoverColor = useColorModeValue(
    isActive ? "cyan.800" : "gray.900",
    isActive ? "cyan.100" : "white"
  );
  const iconColor = useColorModeValue(
    isActive ? "cyan.600" : "gray.600",
    isActive ? "cyan.300" : "gray.400"
  );

  const handleClick = () => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <Flex
      onClick={handleClick}
      role="button"
      align="center"
      gap={3}
      py={3}
      px={4}
      borderRadius="lg"
      cursor="pointer"
      fontWeight={isActive ? "semibold" : "medium"}
      fontSize="md"
      bg={isActive ? activeBg : "transparent"}
      color={isActive ? activeColor : inactiveColor}
      borderLeft="3px solid"
      borderLeftColor={isActive ? "cyan.500" : "transparent"}
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
        color: hoverColor,
        transform: "translateX(4px)",
      }}
      {...rest}
    >
      <Icon fontSize="22" as={icon} color={iconColor} />
      <Text>{name}</Text>
    </Flex>
  );
};
