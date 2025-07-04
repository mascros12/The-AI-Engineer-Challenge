"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { Race } from "@/app/components/Navbar";

interface ChatSession {
  _id: string;
  title: string;
  race: Race;
  messages: Array<{
    role: "user" | "ai";
    content: string;
  }>;
  model: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

const raceColors = {
  imperium: {
    bg: "bg-yellow-900/20",
    border: "border-yellow-700",
    text: "text-yellow-300",
    badge: "bg-yellow-900 text-yellow-200"
  },
  chaos: {
    bg: "bg-red-900/20",
    border: "border-red-700",
    text: "text-red-300",
    badge: "bg-red-900 text-red-200"
  },
  xenos: {
    bg: "bg-green-900/20",
    border: "border-green-700",
    text: "text-green-300",
    badge: "bg-green-900 text-green-200"
  }
};

export default function HistorialPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chat/history");
      if (!response.ok) {
        throw new Error("Error cargando el historial");
      }
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      setError("Error cargando el historial de chats");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta sesión?")) {
      return;
    }

    try {
      const response = await fetch(`/api/chat/${sessionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error eliminando la sesión");
      }
      // Recargar la lista
      loadChatHistory();
      if (selectedSession?._id === sessionId) {
        setSelectedSession(null);
      }
    } catch (err) {
      console.error("Error eliminando sesión:", err);
      alert("Error eliminando la sesión");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRaceDisplayName = (race: Race) => {
    const names = {
      imperium: "Imperio",
      chaos: "Caos",
      xenos: "Xenos"
    };
    return names[race];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">
          🔄 Cargando historial imperial...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-yellow-900">
      {/* Header */}
      <div className="bg-black/90 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yellow-400">
            📚 Historial de Chats Imperiales
          </h1>
          <button
            onClick={() => router.push("/")}
            className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Volver al Chat
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de sesiones */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">
              Sesiones ({sessions.length})
            </h2>
            
            {sessions.length === 0 ? (
              <div className="bg-gray-900/50 border border-gray-700 p-8 rounded-lg text-center">
                <p className="text-gray-400">No hay chats guardados aún</p>
                <p className="text-sm text-gray-500 mt-2">
                  Los chats se guardarán automáticamente cuando uses el chat principal
                </p>
              </div>
            ) : (
              sessions.map((session) => {
                const colors = raceColors[session.race];
                return (
                  <div
                    key={session._id}
                    className={`${colors.bg} border ${colors.border} rounded-lg p-4 cursor-pointer hover:bg-opacity-30 transition-all ${
                      selectedSession?._id === session._id ? "ring-2 ring-yellow-500" : ""
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold ${colors.text}`}>
                        {session.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session._id);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                        title="Eliminar sesión"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${colors.badge}`}>
                        {getRaceDisplayName(session.race)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {session.message_count} mensajes
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400">
                      {formatDate(session.created_at)}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Contenido de la sesión seleccionada */}
          <div className="lg:sticky lg:top-4">
            {selectedSession ? (
              <div className="bg-black/70 border border-gray-700 rounded-lg">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-yellow-300">
                    {selectedSession.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${raceColors[selectedSession.race].badge}`}>
                      {getRaceDisplayName(selectedSession.race)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(selectedSession.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
                  {selectedSession.messages.map((message, index) => {
                    const colors = raceColors[selectedSession.race];
                    return (
                      <div
                        key={index}
                        className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                          message.role === "user"
                            ? `ml-auto ${colors.bg} ${colors.text} border ${colors.border}`
                            : `mr-auto bg-gray-900 ${colors.text} border ${colors.border}`
                        }`}
                      >
                        <MarkdownRenderer
                          content={message.content}
                          selectedRace={selectedSession.race}
                          isUser={message.role === "user"}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400">
                  Selecciona una sesión para ver los mensajes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 