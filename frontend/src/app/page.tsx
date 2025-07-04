import { ChatImperial } from "@/app/components/ChatImperial";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-yellow-900 dark:from-gray-950 dark:via-gray-900 dark:to-yellow-900 transition-colors">
      <header className="w-full max-w-2xl py-8 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 drop-shadow-lg tracking-widest text-center">
          Imperium Chat
        </h1>
        <p className="text-gray-300 mt-2 text-center max-w-md">
          &quot;El pensamiento es el enemigo de la fe.&quot;<br/>
          Bienvenido, ciudadano del Imperio. Consulta al Adeptus Mechanicus o comparte tus inquietudes.
        </p>
      </header>
      <main className="flex-1 w-full max-w-2xl flex flex-col">
        <ChatImperial />
      </main>
      <footer className="py-4 text-xs text-gray-500 text-center w-full">
        Ave Imperator. Warhammer 40K Chat &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
