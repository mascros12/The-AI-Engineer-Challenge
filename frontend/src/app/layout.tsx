import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Warhammer 40K Chat",
  description: "ChatGPT temático con razas de Warhammer 40K",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={roboto.className}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
