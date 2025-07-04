import React, { useState, useEffect } from 'react';
import styles from '../styles/Chat.module.css';
import MessageInput from './MessageInput';

export interface Message {
  role: 'user' | 'developer';
  content: string;
}

interface LoadedSession {
  session_id?: string;
  title: string;
  race: string;
  messages: { role: 'user' | 'developer'; content: string }[];
  model: string;
  message_count: number;
}

interface ChatProps {
  session?: LoadedSession | null;
  theme: string;
}

const getRaceFromTheme = (theme: string) => {
  if (theme === 'imperium') return 'imperium';
  if (theme === 'chaos') return 'chaos';
  if (theme === 'xenos') return 'xenos';
  return 'imperium';
};

const generateTitle = (userMessage: string) => {
  // Toma las primeras 6 palabras del mensaje del usuario como título
  return userMessage.split(' ').slice(0, 6).join(' ') + (userMessage.split(' ').length > 6 ? '...' : '');
};

// Componente principal del chat
const Chat: React.FC<ChatProps> = ({ session, theme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingMsg, setStreamingMsg] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [race, setRace] = useState<string>(getRaceFromTheme(theme));
  const [model, setModel] = useState<string>('gpt-4.1-mini');

  // Función para convertir mensajes a tipo Message
  const toMessageArray = (arr: any[]): Message[] =>
    arr.map((m) => ({ role: m.role as 'user' | 'developer', content: m.content }));

  // Limpiar o cargar mensajes al cambiar sesión o tema
  useEffect(() => {
    if (session) {
      setMessages(toMessageArray(session.messages));
      setSessionId(session.session_id || null);
      setTitle(session.title);
      setRace(session.race);
      setModel(session.model || 'gpt-4.1-mini');
    } else {
      setMessages([]);
      setSessionId(null);
      setTitle('');
      setRace(getRaceFromTheme(theme));
      setModel('gpt-4.1-mini');
    }
    setStreamingMsg(null);
  }, [session, theme]);

  // Función para enviar un mensaje y manejar streaming, guardando/actualizando la sesión
  const handleSend = async (userMessage: string, developerMessage: string, apiKey: string, modelParam: string) => {
    setLoading(true);
    setStreamingMsg('');
    let newMessages = [...messages, { role: 'user' as 'user', content: userMessage }];
    setMessages(newMessages);
    let developerReply = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model: modelParam,
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
      developerReply = fullMsg;
      newMessages = [...newMessages, { role: 'developer' as 'developer', content: developerReply }];
      setMessages(newMessages);
      setStreamingMsg(null);

      // Guardar o actualizar la sesión en el backend
      if (!sessionId) {
        // Es una nueva sesión: generar título y guardar
        const generatedTitle = generateTitle(userMessage);
        setTitle(generatedTitle);
        const saveRes = await fetch('/api/chat/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: generatedTitle,
            race: getRaceFromTheme(theme),
            messages: newMessages,
            model: modelParam,
          }),
        });
        const saveData = await saveRes.json();
        if (saveData.session_id) {
          setSessionId(saveData.session_id);
        }
      } else {
        // Actualizar la sesión existente
        await fetch('/api/chat/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            messages: newMessages,
          }),
        });
      }
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