import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useThemeContext } from "@/contexts/theme-context";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Button onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
