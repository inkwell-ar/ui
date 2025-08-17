import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useThemeContext } from "./ThemeProvider";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <Button onClick={toggleTheme}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

export default ThemeToggle;
