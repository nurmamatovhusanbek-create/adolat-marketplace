import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider, AppUserProvider } from "@/lib/auth/user-provider";

// Phase 1 — Typography fix per UI Revolution plan §3.3
// - Body: Inter (kept — proven Cyrillic/Latin support)
// - Display/headings: IBM Plex Sans (replaces dead Playfair Display — technical,
//   document-adjacent grotesk with full Cyrillic coverage)
// - Mono/reference codes: JetBrains Mono (kept — structurally important for
//   the Registry direction's reference tags like ADV·0231, SHR·014)
//
// Variable names now match what globals.css expects:
//   --font-body    → Inter
//   --font-display → IBM Plex Sans
//   --font-mono    → JetBrains Mono
const interBody = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const plexDisplay = IBM_Plex_Sans({
  variable: "--font-display",
  weight: ["500", "600", "700"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext", "cyrillic"],
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
        className={`${interBody.variable} ${plexDisplay.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <AppUserProvider>{children}</AppUserProvider>
        </AuthProvider>
        {/* Phase 0: dead Radix Toaster removed — sonner is the single toast system */}
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
