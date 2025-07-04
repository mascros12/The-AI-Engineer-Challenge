"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type Race = "imperium" | "chaos" | "xenos";

interface NavbarProps {
  selectedRace: Race;
  onRaceChange: (race: Race) => void;
}

const raceConfig = {
  imperium: {
    name: "Imperium",
    color: "text-yellow-400",
    bgColor: "bg-yellow-900",
    hoverColor: "hover:bg-yellow-800",
    borderColor: "border-yellow-700"
  },
  chaos: {
    name: "Chaos",
    color: "text-red-400",
    bgColor: "bg-red-900",
    hoverColor: "hover:bg-red-800",
    borderColor: "border-red-700"
  },
  xenos: {
    name: "Xenos",
    color: "text-green-400",
    bgColor: "bg-green-900",
    hoverColor: "hover:bg-green-800",
    borderColor: "border-green-700"
  }
};

export function Navbar({ selectedRace, onRaceChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentRace = raceConfig[selectedRace];
  const router = useRouter();

  return (
    <nav className="w-full bg-black/90 border-b border-gray-700 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Título */}
          <div className="flex items-center">
            <h1 className={`text-xl sm:text-2xl font-bold ${currentRace.color} drop-shadow-lg tracking-widest`}>
              ⚡ Warhammer 40K Chat
            </h1>
          </div>

          {/* Navegación y Controles */}
          <div className="flex items-center space-x-4">
            {/* Botón Historial */}
            <button
              onClick={() => router.push("/historial")}
              className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium"
              title="Ver historial de chats"
            >
              📚 Historial
            </button>

            {/* Selector de Razas */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${currentRace.borderColor} ${currentRace.bgColor} ${currentRace.color} ${currentRace.hoverColor} transition-colors font-semibold`}
                aria-label="Seleccionar raza"
              >
                <span>{currentRace.name}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-gray-600 rounded-lg shadow-xl z-50">
                  {Object.entries(raceConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onRaceChange(key as Race);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 ${config.color} ${config.hoverColor} first:rounded-t-lg last:rounded-b-lg transition-colors border-b border-gray-700 last:border-b-0`}
                    >
                      <div className="font-semibold">{config.name}</div>
                      <div className="text-xs opacity-75">
                        {key === "imperium" && "Ave Imperator! Por el Emperador."}
                        {key === "chaos" && "¡Sangre para el Dios de la Sangre!"}
                        {key === "xenos" && "Para la Gran Devoración..."}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click fuera para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
} 