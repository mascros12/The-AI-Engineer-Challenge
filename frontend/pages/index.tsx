import React from 'react';
import { ThemeProvider as ThemeContextProvider } from '../contexts/ThemeContext';
import { ApiKeyProvider } from '../contexts/ApiKeyContext';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

// Aquí irán los demás componentes (Navbar, Sidebar, Chat, etc.)

const HomePage = () => {
  return (
    <ApiKeyProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <Navbar />
          <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column' }}>
              <Chat />
            </main>
          </div>
        </ThemeProvider>
      </ThemeContextProvider>
    </ApiKeyProvider>
  );
};

export default HomePage; 