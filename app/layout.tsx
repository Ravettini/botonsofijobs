import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generador de CVs",
  description: "Generá y revisá los CVs antes de subirlos a Canva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-pink-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
