//  src/themes/system.tsx
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          Cmint: { value: "#AEE5D1" },
          Cblue: { value: "#415380" },
          ink: { value: "#1B2240" },
          CgrayH: { value: "#E4E4E4" },
          CgrayL: { value: "#F2F2F2" },
        },
      },
      fonts: {
        heading: {
          value: 'Poppins, system-ui, -apple-system, "Segoe UI", Roboto',
        },
        body: { value: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto' },
      },
      radii: {
        xl: { value: "1rem" },
      },
    },
    // Opcional: semánticos para bg/fg (útiles si luego activas dark mode)
    semanticTokens: {
      colors: {
        // Backgrounds
        "bg.canvas": {
          value: { base: "white", _dark: "#1A202C" },
        },
        "bg.surface": {
          value: { base: "white", _dark: "#2D3748" },
        },
        "bg.subtle": {
          value: { base: "{colors.brand.CgrayL}", _dark: "#374151" },
        },
        "bg.muted": {
          value: { base: "{colors.brand.CgrayH}", _dark: "#4B5563" },
        },

        // Text colors
        "fg.default": {
          value: { base: "{colors.brand.ink}", _dark: "#FFFFFF" },
        },
        "fg.muted": {
          value: { base: "gray.700", _dark: "gray.300" },
        },
        "fg.subtle": {
          value: { base: "gray.600", _dark: "gray.400" },
        },

        // Brand colors (mantienen su valor en ambos modos)
        "accent.solid": {
          value: {
            base: "{colors.brand.Cblue}",
            _dark: "{colors.brand.Cblue}",
          },
        },
        "accent.emphasis": {
          value: {
            base: "{colors.brand.Cmint}",
            _dark: "{colors.brand.Cmint}",
          },
        },

        // Border colors
        "border.default": {
          value: { base: "gray.200", _dark: "gray.600" },
        },
        "border.emphasized": {
          value: { base: "gray.300", _dark: "gray.500" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
