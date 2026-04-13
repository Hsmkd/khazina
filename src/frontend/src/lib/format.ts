/**
 * Formatters for Hazine — Algerian accounting SaaS
 * Currency: DZD with French number format (space thousands, comma decimal)
 */

/**
 * Format a bigint Amount (in centimes) as DZD currency string.
 * Example: 125000000n → "1 250 000,00 DZD"
 * Amounts are stored in centimes (×100).
 */
export function formatDZD(amount: bigint): string {
  const num = Number(amount) / 100;
  const formatted = num.toLocaleString("fr-DZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Ensure space as thousands separator (some locales use narrow non-breaking space)
  return `${formatted.replace(/\u202f/g, "\u00a0")}\u00a0DZD`;
}

/**
 * Format a bigint Amount without currency suffix.
 * Example: 125000000n → "1 250 000,00"
 */
export function formatAmount(amount: bigint): string {
  const num = Number(amount) / 100;
  return num.toLocaleString("fr-DZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a bigint nanosecond timestamp as DD/MM/YYYY.
 * Backend timestamps are in nanoseconds.
 */
export function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const date = new Date(ms);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format a bigint nanosecond timestamp as DD/MM/YYYY HH:mm.
 */
export function formatDateTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const date = new Date(ms);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Convert a JS Date to a bigint nanosecond timestamp.
 */
export function dateToTimestamp(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

/**
 * Convert today's date to a bigint nanosecond timestamp.
 */
export function todayTimestamp(): bigint {
  return dateToTimestamp(new Date());
}

/**
 * Convert DZD decimal input string to bigint centimes.
 * Example: "1250.50" → 125050n
 */
export function parseDZD(input: string): bigint {
  const cleaned = input.replace(/\s/g, "").replace(",", ".");
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num)) return 0n;
  return BigInt(Math.round(num * 100));
}

/**
 * Format a number with French locale (space thousands, comma decimal).
 */
export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString("fr-DZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Get the label for a Role enum value in French.
 */
export function formatRole(role: string): string {
  const labels: Record<string, string> = {
    Admin: "Administrateur",
    Comptable: "Comptable",
    Gestionnaire: "Gestionnaire",
    Lecteur: "Lecteur",
  };
  return labels[role] ?? role;
}

/**
 * Get the label for FactureStatut in French.
 */
export function formatFactureStatut(statut: string): string {
  const labels: Record<string, string> = {
    Brouillon: "Brouillon",
    Validee: "Validée",
    Payee: "Payée",
    Annulee: "Annulée",
  };
  return labels[statut] ?? statut;
}

/**
 * Get the label for MouvementType in French.
 */
export function formatMouvementType(type: string): string {
  const labels: Record<string, string> = {
    Entree: "Entrée",
    Sortie: "Sortie",
    Ajustement: "Ajustement",
  };
  return labels[type] ?? type;
}

/**
 * Get current year as bigint for exercice.
 */
export function currentExercice(): bigint {
  return BigInt(new Date().getFullYear());
}
