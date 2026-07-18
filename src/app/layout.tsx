import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, AppUserProvider } from "@/lib/auth/user-provider";

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const playfairSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adolat — Huquqiy marketplace | Advokatlar va hujjat namunalari",
  description:
    "O'zbekistonning yuridik marketplace'i: advokatlarni toping, 700+ huquqiy hujjat namunalarini yuklab oling yoki huquqiy so'rovingizni joylang.",
  keywords: [
    "advokat",
    "huquqiy hujjatlar",
    "shartnoma namunasi",
    "ariza namunasi",
    "yuridik xizmat",
    "O'zbekiston",
  ],
  authors: [{ name: "Adolat Marketplace" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Adolat — Huquqiy marketplace",
    description: "Advokatlar va hujjat namunalari bir platformada",
    siteName: "Adolat",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${interSans.variable} ${playfairSerif.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <AppUserProvider>{children}</AppUserProvider>
        </AuthProvider>
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
