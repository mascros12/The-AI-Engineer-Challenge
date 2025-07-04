import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

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
    <html lang="es">
      <body className={`${roboto.variable} bg-black text-white min-h-screen transition-colors font-roboto`}>
        {children}
      </body>
    </html>
  );
}
