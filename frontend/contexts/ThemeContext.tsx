import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos de tema disponibles
export type ThemeType = 'imperium' | 'chaos' | 'xenos';

interface ThemeContextProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Contexto del tema
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Hook para usar el contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

// Proveedor del contexto de tema
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('imperium');

  // Cargar tema desde localStorage al iniciar
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (storedTheme) setThemeState(storedTheme);
  }, []);

  // Guardar tema en localStorage cuando cambie
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Este contexto permite cambiar y persistir el tema visual de la app entre Imperium, Chaos y Xenos. 