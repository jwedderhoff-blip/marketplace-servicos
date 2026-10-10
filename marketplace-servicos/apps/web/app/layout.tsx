import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Platz — Serviços locais, quando você precisar",
  description:
    "Encontre eletricistas, encanadores, pintores e muito mais perto de você. Avaliações reais, resposta em minutos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: "#0A0612" }}>{children}</body>
    </html>
  );
}
