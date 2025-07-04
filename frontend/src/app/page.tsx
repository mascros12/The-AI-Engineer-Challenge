"use client";
import { useState } from "react";
import { ChatImperial } from "@/app/components/ChatImperial";
import { Navbar, Race } from "@/app/components/Navbar";

const raceThemes = {
  imperium: "from-black via-gray-900 to-yellow-900",
  chaos: "from-black via-gray-900 to-red-900",
  xenos: "from-black via-gray-900 to-green-900"
};

const raceSubtitles = {
  imperium: {
    quote: "&quot;El pensamiento es el enemigo de la fe.&quot;",
    description: "Bienvenido, ciudadano del Imperio. Consulta al Adeptus Mechanicus o comparte tus inquietudes."
  },
  chaos: {
    quote: "&quot;¡Que arda la galaxia!&quot;",
    description: "Los susurros del Warp te llaman, mortal. Los daemons tienen conocimiento... si te atreves."
  },
  xenos: {
    quote: "&quot;Your primitive understanding amuses us.&quot;",
    description: "Advanced beings from beyond the stars await your queries, human."
  }
};

export default function Home() {
  const [selectedRace, setSelectedRace] = useState<Race>("imperium");
  const currentTheme = raceThemes[selectedRace];
  const currentSubtitle = raceSubtitles[selectedRace];

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b ${currentTheme} transition-colors duration-500`}>
      <Navbar selectedRace={selectedRace} onRaceChange={setSelectedRace} />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <header className="w-full max-w-2xl py-8 flex flex-col items-center">
          <p className="text-gray-300 mt-2 text-center max-w-md">
            <span dangerouslySetInnerHTML={{ __html: currentSubtitle.quote }} /><br/>
            {currentSubtitle.description}
          </p>
        </header>
        
        <main className="flex-1 w-full max-w-2xl flex flex-col">
          <ChatImperial selectedRace={selectedRace} />
        </main>
        
        <footer className="py-4 text-xs text-gray-500 text-center w-full">
          Ave Imperator. Warhammer 40K Chat &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
