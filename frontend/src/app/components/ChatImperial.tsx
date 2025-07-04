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

const raceBubble = {
  imperium: {
    user: "bg-yellow-100 text-yellow-900 border border-yellow-400",
    ai: "bg-white bg-opacity-10 text-yellow-100 border border-yellow-700",
    send: "bg-yellow-500 hover:bg-yellow-600 text-white",
    input: "focus:ring-yellow-500 border-yellow-400"
  },
  chaos: {
    user: "bg-red-100 text-red-900 border border-red-400",
    ai: "bg-white bg-opacity-10 text-red-100 border border-red-700",
    send: "bg-red-500 hover:bg-red-600 text-white",
    input: "focus:ring-red-500 border-red-400"
  },
  xenos: {
    user: "bg-green-100 text-green-900 border border-green-400",
    ai: "bg-white bg-opacity-10 text-green-100 border border-green-700",
    send: "bg-green-500 hover:bg-green-600 text-white",
    input: "focus:ring-green-500 border-green-400"
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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      role: "ai",
      content: config.welcomeMessage,
    }]);
    setSaveStatus("idle");
  }, [selectedRace, config.welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveChat = async (chatMessages: Message[], isAutoSave = false) => {
    if (chatMessages.length <= 1) return;
    try {
      setSaveStatus("saving");
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
      if (!response.ok) throw new Error("Error guardando el chat");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
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
      const finalMessages = [...newMessages, { role: "ai" as const, content: aiMsg }];
      await saveChat(finalMessages, true);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "ai" as const,
          content: config.errorMessage,
        },
      ]);
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
    <div className="flex flex-col h-full w-full">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] shadow-lg whitespace-pre-line text-base font-normal
                  ${msg.role === "user" ? raceBubble[selectedRace].user : raceBubble[selectedRace].ai}
                `}
                style={{ boxShadow: "0 4px 12px 0 rgba(0,0,0,0.3)" }}
              >
                <MarkdownRenderer
                  content={msg.content}
                  selectedRace={selectedRace}
                  isUser={msg.role === "user"}
                />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input fijo abajo */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-black from-opacity-90 to-transparent backdrop-blur-sm border-t border-gray-800 border-opacity-50 z-20">
        <form
          className="max-w-2xl mx-auto flex items-center gap-3 py-4 px-4"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            className={`flex-1 rounded-xl px-4 py-3 bg-gray-900 bg-opacity-80 border border-gray-700 text-white placeholder-gray-400 outline-none shadow-lg focus:outline-none focus:ring-2 ${raceBubble[selectedRace].input}`}
            placeholder={config.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
            maxLength={1000}
          />
          <button
            type="submit"
            className={`px-5 py-3 rounded-xl font-bold text-base shadow-lg transition-all ${raceBubble[selectedRace].send} disabled:opacity-50 disabled:cursor-not-allowed`}
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
      </div>
    </div>
  );
}

// NOTA: El header debe estar fuera de este componente, en layout o page, para ser siempre oscuro y fijo. 