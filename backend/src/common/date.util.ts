export function getTodayWibDateString(): string {
  // UTC+7 (Waktu Indonesia Barat) kalender YYYY-MM-DD konsisten lintas timezone server
  return new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
