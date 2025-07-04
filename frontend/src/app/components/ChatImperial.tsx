"use client";
import { useState, useRef, useEffect } from "react";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { Race } from "@/app/components/Navbar";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatImperialProps {
  selectedRace: Race;
}

const raceConfig = {
  imperium: {
    aiName: "Adeptus Mechanicus",
    welcomeMessage: "¡Ave Imperator! Soy el Oráculo del Adeptus Mechanicus. ¿En qué puedo servir al Imperio hoy?",
    placeholder: "Escribe tu mensaje para el Imperio...",
    errorMessage: "El espíritu máquina no responde. Intenta de nuevo o consulta a tu Tecnosacerdote local.",
    developerMessage: "Responde como un servidor imperial del Adeptus Mechanicus, fiel al Emperador, usando tono formal y referencias al Imperio de la Humanidad.",
    colors: {
      userBg: "bg-yellow-900",
      userText: "text-yellow-100",
      userBorder: "border-yellow-700",
      aiBg: "bg-gray-900",
      aiText: "text-yellow-300",
      aiBorder: "border-yellow-800",
      chatBorder: "border-yellow-900",
      inputBorder: "border-yellow-800",
      inputFocus: "focus:ring-yellow-600",
      button: "bg-yellow-700 hover:bg-yellow-800"
    }
  },
  chaos: {
    aiName: "Daemon del Caos",
    welcomeMessage: "¡Mortales patéticos! Soy un daemon del Caos. Las fuerzas oscuras susurran secretos... ¿qué deseas saber?",
    placeholder: "Habla, mortal, si te atreves...",
    errorMessage: "Los dioses del Caos guardan silencio... Su ira es impredecible. Intenta de nuevo.",
    developerMessage: "Responde como un daemon del Caos, malévolo pero informativo, usando referencias a los Dioses del Caos y el Warp.",
    colors: {
      userBg: "bg-red-900",
      userText: "text-red-100",
      userBorder: "border-red-700",
      aiBg: "bg-gray-900",
      aiText: "text-red-300",
      aiBorder: "border-red-800",
      chatBorder: "border-red-900",
      inputBorder: "border-red-800",
      inputFocus: "focus:ring-red-600",
      button: "bg-red-700 hover:bg-red-800"
    }
  },
  xenos: {
    aiName: "Entidad Xenos",
    welcomeMessage: "Saludos, ser inferior. Soy una entidad Xenos. La galaxia guarda muchos secretos más allá de tu comprensión...",
    placeholder: "Habla, humano primitivo...",
    errorMessage: "La conexión psíquica se ha perdido. Los Xenos no responden a tu frecuencia mental.",
    developerMessage: "Responde como una entidad Xenos superior e inteligente, condescendiente pero informativa, con referencias a tecnología avanzada y perspectiva galáctica.",
    colors: {
      userBg: "bg-green-900",
      userText: "text-green-100",
      userBorder: "border-green-700",
      aiBg: "bg-gray-900",
      aiText: "text-green-300",
      aiBorder: "border-green-800",
      chatBorder: "border-green-900",
      inputBorder: "border-green-800",
      inputFocus: "focus:ring-green-600",
      button: "bg-green-700 hover:bg-green-800"
    }
  }
};

export function ChatImperial({ selectedRace }: ChatImperialProps) {
  const config = raceConfig[selectedRace];
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: config.welcomeMessage,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Actualizar mensaje de bienvenida cuando cambie la raza
  useEffect(() => {
    setMessages([{
      role: "ai",
      content: config.welcomeMessage,
    }]);
    // Reset session when race changes
    setCurrentSessionId(null);
    setSaveStatus("idle");
  }, [selectedRace, config.welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveChat = async (chatMessages: Message[], isAutoSave = false) => {
    // Only save if we have actual conversation (more than just welcome message)
    if (chatMessages.length <= 1) return;

    try {
      setSaveStatus("saving");
      
      // Generate a title from the first user message
      const firstUserMessage = chatMessages.find(m => m.role === "user");
      const title = firstUserMessage 
        ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "")
        : `Chat ${selectedRace} - ${new Date().toLocaleDateString()}`;

      const response = await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          race: selectedRace,
          messages: chatMessages,
          model: "gpt-4.1-mini"
        }),
      });

      if (!response.ok) {
        throw new Error("Error guardando el chat");
      }

      const data = await response.json();
      setCurrentSessionId(data.session_id);
      setSaveStatus("saved");
      
      if (!isAutoSave) {
        console.log("💾 Chat guardado exitosamente");
      }
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
      
    } catch (error) {
      console.error("Error guardando chat:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    const newMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    
    try {
      const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: config.developerMessage,
          user_message: userMsg,
          model: "gpt-4.1-mini",
          api_key,
        }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let aiMsg = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMsg += new TextDecoder().decode(value);
        setMessages((msgs) => {
          const last = msgs[msgs.length - 1];
          if (last && last.role === "ai") {
            return [...msgs.slice(0, -1), { ...last, content: aiMsg }];
          } else {
            return [...msgs, { role: "ai", content: aiMsg }];
          }
        });
      }
      
      // Auto-save after AI response
      const finalMessages = [...newMessages, { role: "ai" as const, content: aiMsg }];
      await saveChat(finalMessages, true);
      
    } catch {
      const errorMessages = [
        ...newMessages,
        {
          role: "ai" as const,
          content: config.errorMessage,
        },
      ];
      setMessages(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case "saving": return "Guardando...";
      case "saved": return "✅ Guardado";
      case "error": return "❌ Error";
      default: return "💾 Guardar";
    }
  };

  const getSaveButtonClass = () => {
    const base = "px-3 py-2 rounded-lg text-xs font-medium transition-colors";
    switch (saveStatus) {
      case "saving": return `${base} bg-blue-700 text-blue-100 cursor-not-allowed`;
      case "saved": return `${base} bg-green-700 text-green-100`;
      case "error": return `${base} bg-red-700 text-red-100`;
      default: return `${base} bg-gray-700 text-gray-200 hover:bg-gray-600`;
    }
  };

  return (
    <section className={`flex flex-col h-[60vh] sm:h-[70vh] bg-black/70 border ${config.colors.chatBorder} rounded-xl shadow-lg overflow-hidden`}>
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-lg shadow-md text-sm
              ${msg.role === "user"
                ? `ml-auto ${config.colors.userBg} ${config.colors.userText} border ${config.colors.userBorder}`
                : `mr-auto ${config.colors.aiBg} ${config.colors.aiText} border ${config.colors.aiBorder} font-semibold`}
            `}
          >
            <MarkdownRenderer 
              content={msg.content} 
              selectedRace={selectedRace}
              isUser={msg.role === "user"}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input y acciones */}
      <form
        className={`flex gap-2 p-3 border-t ${config.colors.chatBorder} bg-black/80`}
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className={`flex-1 rounded-lg px-3 py-2 bg-gray-950 ${config.colors.aiText} border ${config.colors.inputBorder} focus:outline-none focus:ring-2 ${config.colors.inputFocus}`}
          placeholder={config.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className={`${config.colors.button} text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50`}
          disabled={loading || !input.trim()}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
        <button
          type="button"
          onClick={() => saveChat(messages)}
          disabled={saveStatus === "saving" || messages.length <= 1}
          className={getSaveButtonClass()}
          title="Guardar chat manualmente"
        >
          {getSaveButtonText()}
        </button>
      </form>
    </section>
  );
} 