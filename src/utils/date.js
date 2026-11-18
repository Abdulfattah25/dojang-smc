/**
 * Date and time formatting helpers for Asia/Makassar (WITA / UTC+8).
 */

function parseUtcDate(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;
  let str = String(dateInput).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
    str = str.replace(' ', 'T') + 'Z';
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

export function formatWitaDate(dateStr) {
  const d = parseUtcDate(dateStr);
  if (!d) return '-';
  return d.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatWitaDateTime(dateStr) {
  const d = parseUtcDate(dateStr);
  if (!d) return '-';
  return d.toLocaleString('id-ID', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '') + ' WITA';
}

export function getWitaToday() {
  const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
  return d.toISOString().substring(0, 10);
}
