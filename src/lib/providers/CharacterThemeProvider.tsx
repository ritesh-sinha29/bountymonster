"use client";

import React, { createContext, useContext, useEffect } from "react";
import { loadPersistedTheme, CharacterTheme, applyCharacterTheme } from "@/lib/themes";

interface CharacterThemeContextType {
  setTheme: (theme: CharacterTheme) => void;
}

const CharacterThemeContext = createContext<CharacterThemeContextType | undefined>(undefined);

export const CharacterThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    loadPersistedTheme();
  }, []);

  const setTheme = (theme: CharacterTheme) => {
    applyCharacterTheme(theme);
  };

  return (
    <CharacterThemeContext.Provider value={{ setTheme }}>
      {children}
    </CharacterThemeContext.Provider>
  );
};

export const useCharacterTheme = () => {
  const context = useContext(CharacterThemeContext);
  if (!context) {
    throw new Error("useCharacterTheme must be used within a CharacterThemeProvider");
  }
  return context;
};
