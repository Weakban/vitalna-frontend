// src/components/Navbar.tsx
import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Button,
  IconButton,
  useDisclosure,
  Collapsible,
  CollapsibleTrigger,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiFacebook,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Inicio", to: "/" },
  { label: "Servicios", to: "/servicios" },
  { label: "Profesionales", to: "/profesionales" },
  { label: "Contacto", to: "/contacto" },
];

export default function Navbar() {
  const { open, onToggle, onOpen } = useDisclosure();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg="white"
      boxShadow="sm"
    >
      <Container maxW="6xl">
        <Flex h={16} align="center" justify="space-between">
          {/* Logo */}
          <RouterLink to="/">
            {/* Reemplaza por tu SVG del logo */}
            <Box fontWeight="bold" fontSize="xl">
              vitalná
            </Box>
          </RouterLink>

          {/* Desktop menu */}
          <HStack display={{ base: "none", md: "flex" }} gap={6}>
            {NAV_ITEMS.map((item) => (
              <Link
                as={RouterLink}
                key={item.to}
                href={item.to}
                _hover={{ color: "brand.lilac" }}
              >
                {item.label}
              </Link>
            ))}
          </HStack>

          <HStack gap={3} display={{ base: "none", md: "flex" }}>
            <IconButton aria-label="Facebook" variant="ghost">
              <FiFacebook />
            </IconButton>
            <IconButton aria-label="Instagram" variant="ghost">
              <FiInstagram />
            </IconButton>
            <IconButton aria-label="Twitter" variant="ghost">
              <FiTwitter />
            </IconButton>
            <Button variant="solid">
              <a href="/reserva">Reservar</a>
            </Button>
          </HStack>

          {/* Mobile toggle */}
          <IconButton
            display={{ base: "inline-flex", md: "none" }}
            onClick={onToggle}
            aria-label="Menu"
            variant="ghost"
          >
            {open ? <FiX /> : <FiMenu />}
          </IconButton>
        </Flex>

        {/* Mobile menu */}
        <Collapsible.Root open={open}>
          <CollapsibleTrigger>
            <Collapsible.Content>
              <Box pb={4} display={{ md: "none" }}>
                <HStack gap={10} align="stretch">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      as={RouterLink}
                      key={item.to}
                      href={item.to}
                      py={2}
                      _hover={{ color: "brand.Cmint" }}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <Button mt={2} color="brand.">
                    <a href="/reserva">Reservar</a>
                  </Button>
                </HStack>
              </Box>
            </Collapsible.Content>
          </CollapsibleTrigger>
        </Collapsible.Root>
      </Container>
    </Box>
  );
}
