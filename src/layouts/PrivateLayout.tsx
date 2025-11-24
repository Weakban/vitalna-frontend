// src/AppLayout.tsx

import Sidebar from "@/components/SideBar";
import { Box, HStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout() {
  //const [isOpen, setIsOpen] = useState(false);
  //const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <HStack align="stretch" gap={0} position="relative">
      <Sidebar />
      <Box as="main" flex="1" minWidth={0} position="relative" zIndex={1}>
        <Outlet />
        <Toaster />
      </Box>
    </HStack>
  );
}
