import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatBot IA - Assistant Intelligent",
  description: "Un chatbot intelligent alimenté par OpenAI pour répondre à toutes vos questions",
  keywords: ["chatbot", "IA", "assistant", "OpenAI", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
