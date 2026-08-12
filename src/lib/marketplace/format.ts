// Currency and number formatting helpers
import type { Currency } from "./types";

export function formatPrice(amount: number, currency: Currency = "UZS"): string {
  if (currency === "UZS") {
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)} mln so'm`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)} ming so'm`;
    }
    return `${amount} so'm`;
  }
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("ru-RU");
}

export function formatDownloads(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}
