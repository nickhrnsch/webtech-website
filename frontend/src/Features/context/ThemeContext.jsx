import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "../../theme/theme";

const ThemeContext = createContext(null);

const STORAGE_KEY = "colorMode";

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode muss innerhalb von ThemeWrapper verwendet werden");
  }
  return ctx;
}

export function ThemeWrapper({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    const hexToRgb = (hex) => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}` : "0, 121, 107";
    };
    root.style.setProperty("--theme-primary", theme.palette.primary.main);
    root.style.setProperty("--theme-primary-rgb", hexToRgb(theme.palette.primary.main));
    root.style.setProperty("--theme-primary-light", theme.palette.primary.light);
    root.style.setProperty("--theme-primary-dark", theme.palette.primary.dark);
    root.style.setProperty("--theme-secondary", theme.palette.secondary.main);
    root.style.setProperty(
      "--theme-background-default",
      theme.palette.background?.default ?? "#ffffff"
    );
    root.style.setProperty(
      "--theme-background-paper",
      theme.palette.background?.paper ?? "#ffffff"
    );
    root.style.setProperty(
      "--theme-text-primary",
      theme.palette.text?.primary ?? "rgba(0, 0, 0, 0.87)"
    );
    root.style.setProperty(
      "--theme-text-secondary",
      theme.palette.text?.secondary ?? "rgba(0, 0, 0, 0.6)"
    );
  }, [mode, theme]);

  const value = useMemo(
    () => ({ mode, toggleColorMode }),
    [mode, toggleColorMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
