import React, { useState } from 'react';
import styles from '../styles/Chat.module.css';
import MessageInput from './MessageInput';

export interface Message {
  role: 'user' | 'developer';
  content: string;
}

// Componente principal del chat
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingMsg, setStreamingMsg] = useState<string | null>(null);

  // Función para enviar un mensaje y manejar streaming
  const handleSend = async (userMessage: string, developerMessage: string, apiKey: string, model: string) => {
    setLoading(true);
    setStreamingMsg('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model,
          api_key: apiKey,
        }),
      });
      if (!res.body) throw new Error('No se recibió stream de respuesta');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullMsg = '';
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          fullMsg += chunk;
          setStreamingMsg(fullMsg);
        }
      }
      setMessages(prev => [...prev, { role: 'developer', content: fullMsg }]);
      setStreamingMsg(null);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'developer', content: 'Error al obtener respuesta del servidor.' }]);
      setStreamingMsg(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.chatSection}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.role === 'user' ? styles.userMsg : styles.devMsg}
          >
            <span>{msg.content}</span>
          </div>
        ))}
        {/* Mensaje en streaming */}
        {streamingMsg !== null && (
          <div className={styles.devMsg}>
            <span>{streamingMsg}</span>
          </div>
        )}
        {loading && streamingMsg === null && <div className={styles.loading}>Pensando...</div>}
      </div>
      <MessageInput onSend={handleSend} disabled={loading} />
    </section>
  );
};

export default Chat; 