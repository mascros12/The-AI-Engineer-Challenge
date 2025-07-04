import React, { useEffect, useState } from 'react';
import styles from '../styles/Sidebar.module.css';

interface Session {
  _id: string;
  title: string;
  race: string;
  messages: any[];
  model: string;
  message_count: number;
}

interface HistoryResponse {
  sessions: Session[];
  count: number;
}

interface SidebarProps {
  onSelectSession: (sessionId: string) => void;
  selectedSessionId?: string;
}

// Componente del historial de chats (Sidebar)
const Sidebar: React.FC<SidebarProps> = ({ onSelectSession, selectedSessionId }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/chat/history');
        if (!res.ok) throw new Error('Error al obtener el historial');
        const data: HistoryResponse = await res.json();
        console.log(data);
        setSessions(data.sessions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Historial</h2>
      {loading && <div>Cargando...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <ul className={styles.sessionList}>
        {sessions.map((s) => (
          <li
            key={s._id}
            className={
              styles.sessionItem +
              (selectedSessionId === s._id ? ' ' + styles.selected : '')
            }
            onClick={() => onSelectSession(s._id)}
          >
            <div className={styles.title}>{s.title}</div>
            <div className={styles.meta}>
              <span className={styles.race}>{s.race}</span>
              <span className={styles.count}>{s.message_count} mensajes</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar; 