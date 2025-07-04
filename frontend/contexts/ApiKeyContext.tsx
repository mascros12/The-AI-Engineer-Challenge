import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyContextProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

// Contexto de la API Key
const ApiKeyContext = createContext<ApiKeyContextProps | undefined>(undefined);

// Hook para usar el contexto de la API Key
export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey debe usarse dentro de ApiKeyProvider');
  }
  return context;
};

// Proveedor del contexto de la API Key
export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyState] = useState('');

  // Cargar apiKey desde localStorage al iniciar
  useEffect(() => {
    const storedKey = localStorage.getItem('api_key');
    if (storedKey) setApiKeyState(storedKey);
  }, []);

  // Guardar apiKey en localStorage cuando cambie
  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('api_key', key);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

// Este contexto permite guardar y acceder a la API Key de forma global y persistente. 