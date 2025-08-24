import { THEME_STORAGE_KEY } from '@/lib/constants';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren,
} from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
    toggleTheme: () => void;
};

type ThemeContextProviderProps = PropsWithChildren;

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

export const ThemeContextProvider = ({
    children,
}: ThemeContextProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Initialize from localStorage
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return (savedTheme as Theme) || 'light';
    });

    // Toggle between light and dark themes
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Effect to handle DOM class changes and localStorage
    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Also save to localStorage
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
