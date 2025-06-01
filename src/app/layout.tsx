import type { Metadata } from "next";
import "./globals.css";
import ErrorMonitoring from "@/components/ErrorMonitoring";

export const metadata: Metadata = {
  title: "Sudbury Business Directory - Annuaire des entreprises de Sudbury",
  description: "Trouvez rapidement des entreprises locales à Sudbury avec notre assistant intelligent. Restaurants, services, commerces et plus.",
  keywords: ["Sudbury", "annuaire", "entreprises", "commerces", "restaurants", "services", "OpenAI", "IA"],
  authors: [{ name: "Intelletix AI" }],
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://sudbury-business-directory.netlify.app",
    title: "Sudbury Business Directory",
    description: "Annuaire intelligent des entreprises de Sudbury",
    siteName: "Sudbury Business Directory",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <ErrorMonitoring />
        {children}
      </body>
    </html>
  );
}
