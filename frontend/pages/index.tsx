import React, { useState } from 'react';
import { ThemeProvider as ThemeContextProvider, useTheme, ThemeType } from '../contexts/ThemeContext';
import { ApiKeyProvider } from '../contexts/ApiKeyContext';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

// Aquí irán los demás componentes (Navbar, Sidebar, Chat, etc.)

const MainContent: React.FC = () => {
  const { theme } = useTheme();
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);

  // Cargar sesión desde la API
  const handleSelectSession = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    try {
      const res = await fetch(`/api/chat/${sessionId}`);
      if (!res.ok) throw new Error('No se pudo cargar la sesión');
      const data = await res.json();
      setActiveSession(data);
    } catch (err) {
      setActiveSession(null);
    }
  };

  // Limpiar chat al cambiar de tema
  React.useEffect(() => {
    setActiveSession(null);
    setSelectedSessionId(undefined);
  }, [theme]);

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Sidebar onSelectSession={handleSelectSession} selectedSessionId={selectedSessionId} />
        <main style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column' }}>
          <Chat session={activeSession} theme={theme} />
        </main>
      </div>
    </>
  );
};

const HomePage = () => {
  return (
    <ApiKeyProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <MainContent />
        </ThemeProvider>
      </ThemeContextProvider>
    </ApiKeyProvider>
  );
};

export default HomePage; 