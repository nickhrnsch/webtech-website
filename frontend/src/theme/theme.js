/**
 * Hier die Palette anpassen – wirkt app-weit.
 * Light- und Dark-Varianten in getDesignTokens.
 * primary/secondary/success/error/warning: main, optional light, dark, contrastText.
 */

import { createTheme } from "@mui/material/styles";

export function getDesignTokens(mode) {
  return {
    palette: {
      mode,
      primary: {
        main: "#00796B",
        light: "#48A999",
        dark: "#004C40",
        contrastText: "#fff",
      },
      secondary: {
        main: "#E65100",
        light: "#FF833A",
        dark: "#AC1900",
        contrastText: "#fff",
      },
      ...(mode === "dark"
        ? {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
            text: {
              primary: "rgba(255, 255, 255, 0.87)",
              secondary: "rgba(255, 255, 255, 0.6)",
            },
          }
        : {}),
    },
  };
}

export function createAppTheme(mode) {
  return createTheme(getDesignTokens(mode));
}
