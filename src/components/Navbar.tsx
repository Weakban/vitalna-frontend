import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Button,
  IconButton,
  Collapsible,
  useDisclosure,
  Image,
} from "@chakra-ui/react";

import {
  FiMenu,
  FiX,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";

import Vblue from "../assets/Vblue.svg";
import { ColorModeButton } from "./ui/color-mode";

const NAV_ITEMS = [
  { label: "¿Quiénes somos?", to: "#quienes-somos" },
  { label: "Nuestros servicios", to: "#nuestros-servicios" },
  //{ label: "Inicia Sesión", to: "/auth/login" },
  //  { label: "Contacto", to: "/contacto" },
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
      <Container maxW="8xl">
        <Flex
          h={14}
          align="center"
          justify="space-between"
          alignContent="center"
          alignItems="center"
        >
          <Link href="/">
            <Box maxH="full" maxW="sm">
              <Image src={Vblue} alt="Vitalná" h={8} w="auto" display="block" />
            </Box>
          </Link>

          <HStack
            alignContent="center"
            alignItems="center"
            display={{ base: "none", md: "flex" }}
            gap={"20"}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                color="fg.default"
                _hover={{ color: "brand.Cmint" }}
              >
                {item.label}
              </Link>
            ))}
          </HStack>

          <HStack gap={3} display={{ base: "none", md: "flex" }}>
            <IconButton
              aria-label="Facebook"
              variant="ghost"
              _hover={{ color: "brand.Cmint" }}
            >
              <FiFacebook />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              variant="ghost"
              _hover={{ color: "brand.Cmint" }}
            >
              <FiInstagram />
            </IconButton>
            <IconButton
              aria-label="Twitter/X"
              variant="ghost"
              _hover={{ color: "brand.Cmint" }}
            >
              <FiTwitter />
            </IconButton>

            <ColorModeButton />

            <Button
              bg="brand.Cblue"
              color="white"
              _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
            >
              <a href="/auth/register">Registrate</a>
            </Button>
            <Button
              bg="brand.Cblue"
              color="white"
              _hover={{ opacity: 0.9, bg: "brand.Cmint" }}
            >
              <a href="/auth/login">Iniciar Sesión</a>
            </Button>
          </HStack>

          <IconButton
            display={{ base: "inline-flex", md: "none" }}
            onClick={onToggle}
            aria-label="Menu"
            variant="ghost"
          >
            {open ? <FiX /> : <FiMenu />}
          </IconButton>
        </Flex>

        <Collapsible.Root open={open}>
          <Collapsible.Content>
            <Box pb={4} display={{ md: "none" }}>
              <HStack gap={4} align="stretch">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    py={2}
                    _hover={{ color: "colors.brand.lilac" }}
                  >
                    {item.label}
                  </Link>
                ))}

                <ColorModeButton />

                <Button mt={2}>
                  <a href="/auth/register">Registrate</a>
                </Button>

                <Button mt={2}>
                  <a href="/auth/login">Iniciar Sesion</a>
                </Button>
              </HStack>
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>
      </Container>
    </Box>
  );
}
