import React, { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import styles from '../styles/ApiKeyModal.module.css';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal para ingresar la API Key
const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useApiKey();
  const [input, setInput] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(input);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Guardar API Key</h2>
        <input
          type="text"
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Introduce tu API Key"
        />
        <div className={styles.actions}>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal; 