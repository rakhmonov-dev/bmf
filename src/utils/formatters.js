/**
 * Narxni "so'm" formatida ko'rsatish: 450000 -> "450 000 so'm"
 */
export function formatPrice(amount) {
  if (amount === null || amount === undefined) return '';
  const num = Number(amount);
  return `${num.toLocaleString('ru-RU').replace(/,/g, ' ')} so'm`;
}

/**
 * Asl narx va chegirmali narx asosida foiz chegirmasini hisoblaydi.
 * originalPrice bo'lmasa yoki priceAmount'dan kichik/teng bo'lsa,
 * chegirma yo'q deb hisoblanadi (null qaytaradi).
 */
export function calculateDiscountPercent(originalPrice, currentPrice) {
  if (!originalPrice || !currentPrice) return null;
  const original = Number(originalPrice);
  const current = Number(currentPrice);
  if (original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}

/**
 * CEFR darajasini foydalanuvchiga tushunarli ko'rinishga aylantiradi.
 */
export const CEFR_DISPLAY = {
  Boshlangich: "Boshlang'ich",
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
};

/**
 * Har bir CEFR darajasi uchun mos rang klassi — "poydevor" komponentida
 * va boshqa joylarda foydalanish uchun. Pastdan yuqoriga tobora
 * to'qlashib boradi (indigo -> gold gradient hissi).
 */
export const CEFR_COLORS = {
  Boshlangich: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
  A1: { bg: 'bg-ink-50', text: 'text-ink-700', border: 'border-ink-200' },
  A2: { bg: 'bg-ink-100', text: 'text-ink-800', border: 'border-ink-300' },
  B1: { bg: 'bg-ink-700', text: 'text-white', border: 'border-ink-800' },
  B2: { bg: 'bg-gold-200', text: 'text-ink-900', border: 'border-gold-400' },
  C1: { bg: 'bg-gold-400', text: 'text-ink-900', border: 'border-gold-600' },
};

export const APPLICATION_STATUS_DISPLAY = {
  Yangi: 'Yangi',
  Boglandi: "Bog'landi",
  Suhbat: 'Suhbat',
  Qabul_qilindi: 'Qabul qilindi',
  Rad_etildi: 'Rad etildi',
  Oqishga_yozildi: "O'qishga yozildi",
};

export const APPLICATION_STATUS_COLORS = {
  Yangi: 'bg-blue-100 text-blue-700',
  Boglandi: 'bg-amber-100 text-amber-700',
  Suhbat: 'bg-purple-100 text-purple-700',
  Qabul_qilindi: 'bg-emerald-100 text-emerald-700',
  Rad_etildi: 'bg-red-100 text-red-700',
  Oqishga_yozildi: 'bg-ink-100 text-ink-800',
};

/**
 * Sanani "5-avgust, 2026" formatida ko'rsatish uchun.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
  ];
  return `${date.getDate()}-${months[date.getMonth()]}, ${date.getFullYear()}`;
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const formattedDate = formatDate(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formattedDate}, ${hours}:${minutes}`;
}

/**
 * UUID generatsiya qilish — AI chat session ID uchun (crypto.randomUUID
 * mavjud bo'lmasa fallback bilan).
 */
export function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
