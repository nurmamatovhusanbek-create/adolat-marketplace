"use client";

import { Scale, Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube } from "lucide-react";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import type { ViewType } from "@/lib/marketplace/types";

const LINK_COLUMNS: { title: string; links: { label: string; view?: ViewType }[] }[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Advokatlar", view: "advocates" },
      { label: "Hujjat namunalari", view: "documents" },
      { label: "So'rovlar taxtasi", view: "requests" },
      { label: "Qanday ishlaydi", view: "how-it-works" },
    ],
  },
  {
    title: "Hujjatlar",
    links: [
      { label: "Shartnomalar", view: "documents" },
      { label: "Arizalar", view: "documents" },
      { label: "Sud hujjatlari", view: "documents" },
      { label: "Korporativ hujjatlar", view: "documents" },
    ],
  },
  {
    title: "Advokatlar uchun",
    links: [
      { label: "Ro'yxatdan o'tish", view: "for-advocates" },
      { label: "Tariflar", view: "for-advocates" },
      { label: "Profilingizni yarating", view: "for-advocates" },
      { label: "Yordam markazi", view: "how-it-works" },
    ],
  },
  {
    title: "Kompaniya",
    links: [
      { label: "Biz haqimizda" },
      { label: "Yangiliklar" },
      { label: "Karyera" },
      { label: "Bog'lanish" },
    ],
  },
];

export function Footer() {
  const { setView } = useMarketplaceStore();

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      {/* Editorial top accent */}
      <div className="h-0.5 w-full bg-accent" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="font-serif text-base font-bold text-foreground">Adolat</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Huquqiy marketplace
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              O'zbekistonning birinchi huquqiy marketplace'i. Advokatlar va hujjat
              namunalarini bir joyda toping. Vaqtingiz va pulingizni tejang.
            </p>

            <div className="mt-5 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-accent" />
                <a href="mailto:info@adolat.uz" className="hover:text-foreground">
                  info@adolat.uz
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-accent" />
                <a href="tel:+998712020202" className="hover:text-foreground">
                  +998 71 202 02 02
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Toshkent sh., Amir Temur ko'ch., 15
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {[
                { Icon: Send, label: "Telegram" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-accent/40 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {LINK_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  {col.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => link.view && setView(link.view)}
                        className="text-sm text-muted-foreground transition-colors hover:text-accent"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar — editorial newspaper footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-mono">© 2026 Adolat Marketplace</span>
            <span className="text-border">·</span>
            <span>Barcha huquqlar himoyalangan</span>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-wider">
            <a href="#" className="hover:text-foreground">
              Maxfiylik
            </a>
            <a href="#" className="hover:text-foreground">
              Oferta
            </a>
            <a href="#" className="hover:text-foreground">
              Cookie
            </a>
            <a href="#" className="hover:text-foreground">
              Shartlar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
