"use client";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/app/components/ThemeToggle";

interface Message {
  role: "user" | "imperium";
  content: string;
}

export function ChatImperial() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "imperium",
      content:
        "¡Ave Imperator! Soy el Oráculo del Adeptus Mechanicus. ¿En qué puedo servir al Imperio hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((msgs) => [...msgs, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      // Aquí se debe obtener el api_key de forma segura
      const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
      const developer_message = "Responde como un servidor imperial del Adeptus Mechanicus, fiel al Emperador, usando tono formal y referencias al Imperio.";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message,
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
          if (last && last.role === "imperium") {
            return [...msgs.slice(0, -1), { ...last, content: aiMsg }];
          } else {
            return [...msgs, { role: "imperium", content: aiMsg }];
          }
        });
      }
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "imperium",
          content:
            "El espíritu máquina no responde. Intenta de nuevo o consulta a tu Tecnosacerdote local.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col h-[60vh] sm:h-[70vh] bg-black/70 border border-yellow-900 rounded-xl shadow-lg overflow-hidden">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-lg shadow-md text-sm whitespace-pre-line
              ${msg.role === "user"
                ? "ml-auto bg-yellow-900 text-yellow-100 border border-yellow-700"
                : "mr-auto bg-gray-900 text-yellow-300 border border-yellow-800 font-semibold"}
            `}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input y acciones */}
      <form
        className="flex gap-2 p-3 border-t border-yellow-900 bg-black/80"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className="flex-1 rounded-lg px-3 py-2 bg-gray-950 text-yellow-100 border border-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          placeholder="Escribe tu mensaje para el Imperio..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-yellow-700 hover:bg-yellow-800 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
        <ThemeToggle />
      </form>
    </section>
  );
} 