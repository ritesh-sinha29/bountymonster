export type CharacterTheme = "red" | "blue" | "yellow" | "purple" | "rose";

export interface ThemeColors {
  primary: string;
  secondary: string;
}

export const THEME_CONFIG: Record<CharacterTheme, ThemeColors> = {
  red: {
    primary: "oklch(0.627 0.258 23.5)", 
    secondary: "oklch(0.7 0.15 30)", 
  },
  blue: {
    primary: "oklch(0.588 0.158 241.966)", 
    secondary: "oklch(0.7 0.1 240)",
  },
  yellow: {
    primary: "oklch(0.795 0.184 81.187)", 
    secondary: "oklch(0.85 0.1 80)",
  },
  purple: {
    primary: "oklch(0.607 0.213 296.393)", 
    secondary: "oklch(0.75 0.15 300)",
  },
  rose: {
    primary: "oklch(0.607 0.213 7)",
    secondary: "oklch(0.75 0.15 1)",
  },
};

export const applyCharacterTheme = (themeName: CharacterTheme) => {
  if (typeof window === "undefined") return;

  const theme = THEME_CONFIG[themeName];
  if (!theme) return;

  const root = document.documentElement;
  
  // Directly set the dynamic override variables
  root.style.setProperty("--dynamic-primary", theme.primary);
  root.style.setProperty("--dynamic-secondary", theme.secondary);
  
  // Persist the selection
  localStorage.setItem("user-theme-color", themeName);
};


export const loadPersistedTheme = () => {
  if (typeof window === "undefined") return;
  const savedTheme = localStorage.getItem("user-theme-color") as CharacterTheme;
  if (savedTheme && THEME_CONFIG[savedTheme]) {
    applyCharacterTheme(savedTheme);
  }
};
