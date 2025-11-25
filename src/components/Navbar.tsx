import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Link,
  Button,
  IconButton,
  Collapsible,
  useDisclosure,
  Image,
  Stack,
} from "@chakra-ui/react";

import {
  FiMenu,
  FiX,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";

import Vblue from "../assets/VBlue.svg";
import { ColorModeButton } from "./ui/color-mode";

const NAV_ITEMS = [
  { label: "¿Quiénes somos?", to: "#quienes-somos" },
  { label: "Nuestros servicios", to: "#nuestros-servicios" },
];

export default function Navbar() {
  const { open, onToggle } = useDisclosure();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg="bg.muted"
      boxShadow="sm"
    >
      <Container maxW="8xl" px={{ base: 4, md: 6 }}>
        <Flex h={{ base: 16, md: 14 }} align="center" justify="space-between">
          {/* Logo */}
          <Link href="/" _hover={{ opacity: 0.8 }}>
            <Image src={Vblue} alt="Vitalná" h={{ base: 7, md: 8 }} w="auto" />
          </Link>

          {/* Desktop Navigation */}
          <HStack
            display={{ base: "none", lg: "flex" }}
            gap={{ base: 6, xl: 8 }}
            flex={1}
            justify="center"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                color="fg.default"
                fontWeight="medium"
                fontSize={{ base: "sm", xl: "md" }}
                _hover={{ color: "brand.Cmint" }}
                transition="color 0.2s"
              >
                {item.label}
              </Link>
            ))}
          </HStack>

          {/* Desktop Actions */}
          <HStack gap={2} display={{ base: "none", lg: "flex" }}>
            <IconButton
              aria-label="Facebook"
              variant="ghost"
              size="sm"
              _hover={{ color: "brand.Cmint" }}
            >
              <FiFacebook />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              variant="ghost"
              size="sm"
              _hover={{ color: "brand.Cmint" }}
            >
              <FiInstagram />
            </IconButton>
            <IconButton
              aria-label="Twitter/X"
              variant="ghost"
              size="sm"
              _hover={{ color: "brand.Cmint" }}
            >
              <FiTwitter />
            </IconButton>

            <ColorModeButton />

            <Button
              asChild
              bg="brand.Cblue"
              color="white"
              size="sm"
              _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
            >
              <a href="/auth/register">Regístrate</a>
            </Button>
            <Button
              asChild
              bg="brand.Cblue"
              color="white"
              size="sm"
              _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
            >
              <a href="/auth/login">Iniciar Sesión</a>
            </Button>
          </HStack>

          {/* Mobile Menu Button */}
          <HStack gap={2} display={{ base: "flex", lg: "none" }}>
            <ColorModeButton />
            <IconButton
              onClick={onToggle}
              aria-label="Menu"
              variant="ghost"
              size="md"
            >
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </IconButton>
          </HStack>
        </Flex>

        {/* Mobile Menu */}
        <Collapsible.Root open={open}>
          <Collapsible.Content>
            <Box pb={4} pt={2} display={{ lg: "none" }}>
              <VStack gap={3} align="stretch">
                {/* Navigation Links */}
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    py={2}
                    px={3}
                    borderRadius="md"
                    fontWeight="medium"
                    _hover={{ bg: "bg.subtle", color: "brand.Cmint" }}
                    transition="all 0.2s"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Social Icons */}
                <HStack gap={2} px={3} py={2}>
                  <IconButton
                    aria-label="Facebook"
                    variant="ghost"
                    size="sm"
                    _hover={{ color: "brand.Cmint" }}
                  >
                    <FiFacebook />
                  </IconButton>
                  <IconButton
                    aria-label="Instagram"
                    variant="ghost"
                    size="sm"
                    _hover={{ color: "brand.Cmint" }}
                  >
                    <FiInstagram />
                  </IconButton>
                  <IconButton
                    aria-label="Twitter/X"
                    variant="ghost"
                    size="sm"
                    _hover={{ color: "brand.Cmint" }}
                  >
                    <FiTwitter />
                  </IconButton>
                </HStack>

                {/* Auth Buttons */}
                <Stack
                  gap={2}
                  pt={2}
                  borderTop="1px solid"
                  borderColor="border.subtle"
                >
                  <Button
                    asChild
                    bg="brand.Cblue"
                    color="white"
                    w="full"
                    _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
                  >
                    <a href="/auth/register">Regístrate</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    w="full"
                    borderColor="brand.Cblue"
                    color="brand.Cblue"
                    _hover={{ bg: "brand.Cblue", color: "white" }}
                  >
                    <a href="/auth/login">Iniciar Sesión</a>
                  </Button>
                </Stack>
              </VStack>
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      </Container>
    </Box>
  );
}
