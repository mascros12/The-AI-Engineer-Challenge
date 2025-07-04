import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Imperium Chat - Warhammer 40K",
  description: "Chat imperial del Adeptus Mechanicus. Ave Imperator.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-black text-white min-h-screen transition-colors">
        {children}
      </body>
    </html>
  );
}
