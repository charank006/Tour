/**
 * Safe formatting utilities guaranteed to never return NaN or undefined
 */

/**
 * Format a number to Indian Rupee (INR) currency string
 * e.g. 15000 -> ₹15,000
 */
export function formatINR(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '₹0';
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Format a duration in minutes or string to "Xh Ym"
 */
export function formatDuration(duration: number | string | null | undefined): string {
  if (!duration) return '2h 00m';
  if (typeof duration === 'string') {
    if (duration.includes('h') || duration.includes('m')) return duration;
    const parsed = parseInt(duration, 10);
    if (isNaN(parsed)) return '2h 00m';
    duration = parsed;
  }
  const mins = Math.max(0, Math.round(duration));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Calculate accurate number of days between two date strings (inclusive)
 * Clamped between 1 and 30 days
 */
export function calculateDays(startDate: string | null | undefined, endDate: string | null | undefined): number {
  if (!startDate || !endDate) return 3;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 3;

  const diffMs = end.getTime() - start.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(30, days));
}

/**
 * Format an ISO date or date string to readable display (e.g. "Sun, 10 Nov")
 */
export function formatDateDisplay(dateStr: string | null | undefined): string {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'TBD';
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date range display (e.g. "10 Nov – 14 Nov, 2026")
 */
export function formatDateRange(startDate: string | null | undefined, endDate: string | null | undefined): string {
  if (!startDate || !endDate) return 'Dates flexible';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Dates flexible';

  const startFmt = start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  const endFmt = end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startFmt} – ${endFmt}`;
}

/**
 * Safely format distance in km (e.g. "280 km")
 */
export function formatDistance(distanceKm: number | string | null | undefined): string {
  if (distanceKm === null || distanceKm === undefined) return 'Approx. 250 km';
  const num = Number(distanceKm);
  if (isNaN(num) || num <= 0) return 'Approx. 250 km';
  return `${Math.round(num)} km`;
}
