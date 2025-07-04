import React, { useState } from 'react';
import styles from '../styles/MessageInput.module.css';
import { useTheme } from '../contexts/ThemeContext';
import { useApiKey } from '../contexts/ApiKeyContext';

interface MessageInputProps {
  onSend: (userMessage: string, developerMessage: string, apiKey: string, model: string) => void;
  disabled?: boolean;
}

// Mensajes de rol según el tema
const developerPrompts = {
  imperium: 'Habla como un miembro del Mechanicum, preciso y lógico, usando jerga tecnológica y reverencia al Omnissiah.',
  chaos: 'Habla como un señor del Caos, caótico, tentador y con un tono oscuro y seductor.',
  xenos: 'Habla como un Orko, usando frases rudas, gramaticalmente incorrectas y con mucha energía.',
};

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const { theme } = useTheme();
  const { apiKey } = useApiKey();
  const model = 'gpt-4.1-mini';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;
    // El developer_message cambia según el tema
    const developerMessage = developerPrompts[theme];
    onSend(input, developerMessage, apiKey, model);
    setInput('');
  };

  return (
    <form className={styles.inputForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Escribe tu mensaje..."
        disabled={disabled}
      />
      <button type="submit" className={styles.sendBtn} disabled={disabled || !input.trim() || !apiKey}>
        Enviar
      </button>
    </form>
  );
};

export default MessageInput; 