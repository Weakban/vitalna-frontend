import { useEffect } from "react";
import { useColorMode } from "../components/ui/color-mode";

export function ForceLightOnce() {
  const { setColorMode } = useColorMode();
  useEffect(() => {
    setColorMode("light");
  }, [setColorMode]);
  return null;
}
