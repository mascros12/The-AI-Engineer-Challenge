import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/Theme.module.css';

interface Props {
  children: React.ReactNode;
}

// Este componente aplica la clase de tema al body según el tema seleccionado
const ThemeProvider: React.FC<Props> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Remueve todas las clases de tema y añade la actual
    document.body.classList.remove(styles.imperium, styles.chaos, styles.xenos);
    document.body.classList.add(styles[theme]);
    // Limpieza al desmontar
    return () => {
      document.body.classList.remove(styles.imperium, styles.chaos, styles.xenos);
    };
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider; 