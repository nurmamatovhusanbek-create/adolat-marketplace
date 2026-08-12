/**
 * Format utilities — UI Revolution Plan §5.2 Utility Consolidation
 * Consolidates scattered formatting functions into one module.
 */

export function formatCurrency(amount: number, currency: string = "so'm"): string {
  return `${amount.toLocaleString("ru-RU")} ${currency}`;
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "Bepul";
  return formatCurrency(amount);
}

export function formatDownloads(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

export function formatNumber(num: number): string {
  return num.toLocaleString("ru-RU");
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("uz-UZ", opts ?? { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(d);
  if (days > 0) return `${days} kun oldin`;
  if (hours > 0) return `${hours} soat oldin`;
  if (minutes > 0) return `${minutes} daqiqa oldin`;
  return "hozir";
}
