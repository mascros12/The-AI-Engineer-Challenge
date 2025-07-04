import React, { useState } from 'react';
import { useTheme, ThemeType } from '../contexts/ThemeContext';
import styles from '../styles/Navbar.module.css';
import ApiKeyModal from './ApiKeyModal';

// Componente de la barra de navegación principal
const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  // Opciones de tema
  const themeOptions: { value: ThemeType; label: string }[] = [
    { value: 'imperium', label: 'Imperium' },
    { value: 'chaos', label: 'Chaos' },
    { value: 'xenos', label: 'Xenos' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Warhammer CR</div>
      <div className={styles.controls}>
        <select
          value={theme}
          onChange={e => setTheme(e.target.value as ThemeType)}
          className={styles.select}
        >
          {themeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button className={styles.apiKeyBtn} onClick={() => setModalOpen(true)}>
          Guardar API Key
        </button>
      </div>
      <ApiKeyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </nav>
  );
};

export default Navbar; 