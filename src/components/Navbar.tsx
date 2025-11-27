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
import { ColorModeButton, useColorModeValue } from "./ui/color-mode";

const NAV_ITEMS = [
  { label: "¿Quiénes somos?", to: "#quienes-somos" },
  { label: "Nuestros servicios", to: "#nuestros-servicios" },
];

export default function Navbar() {
  const { open, onToggle } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const linkColor = useColorModeValue("gray.700", "gray.200");
  const linkHoverColor = useColorModeValue("brand.Cblue", "brand.Cmint");
  const mobileMenuBg = useColorModeValue("white", "gray.800");
  const mobileLinkHover = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg={bgColor}
      boxShadow="sm"
      borderBottomWidth="1px"
      borderColor={borderColor}
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
                color={linkColor}
                fontWeight="medium"
                fontSize={{ base: "sm", xl: "md" }}
                _hover={{ color: linkHoverColor }}
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
              color={linkColor}
              _hover={{ color: linkHoverColor }}
            >
              <FiFacebook />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              variant="ghost"
              size="sm"
              color={linkColor}
              _hover={{ color: linkHoverColor }}
            >
              <FiInstagram />
            </IconButton>
            <IconButton
              aria-label="Twitter/X"
              variant="ghost"
              size="sm"
              color={linkColor}
              _hover={{ color: linkHoverColor }}
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
              color={linkColor}
            >
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </IconButton>
          </HStack>
        </Flex>

        {/* Mobile Menu */}
        <Collapsible.Root open={open}>
          <Collapsible.Content>
            <Box pb={4} pt={2} display={{ lg: "none" }} bg={mobileMenuBg}>
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
                    color={linkColor}
                    _hover={{ bg: mobileLinkHover, color: linkHoverColor }}
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
                    color={linkColor}
                    _hover={{ color: linkHoverColor }}
                  >
                    <FiFacebook />
                  </IconButton>
                  <IconButton
                    aria-label="Instagram"
                    variant="ghost"
                    size="sm"
                    color={linkColor}
                    _hover={{ color: linkHoverColor }}
                  >
                    <FiInstagram />
                  </IconButton>
                  <IconButton
                    aria-label="Twitter/X"
                    variant="ghost"
                    size="sm"
                    color={linkColor}
                    _hover={{ color: linkHoverColor }}
                  >
                    <FiTwitter />
                  </IconButton>
                </HStack>

                {/* Auth Buttons */}
                <Stack
                  gap={2}
                  pt={2}
                  borderTop="1px solid"
                  borderColor={borderColor}
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
                    borderColor={useColorModeValue(
                      "brand.Cblue",
                      "brand.Cmint"
                    )}
                    color={useColorModeValue("brand.Cblue", "brand.Cmint")}
                    _hover={{
                      bg: useColorModeValue("brand.Cblue", "brand.Cmint"),
                      color: useColorModeValue("white", "brand.ink"),
                    }}
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
