/**
 * Admin panelga kirish yo'li atayin standart "/admin/login" emas —
 * bu botlar va tasodifiy tashrif buyuruvchilar tomonidan osongina
 * topilmasligi uchun. Haqiqiy xavfsizlik (parol, JWT, rate limit)
 * backend'da ta'minlangan; bu shunchaki qo'shimcha qatlam —
 * "kim ko'rishi kerak bo'lmagan joyni tasodifan topib qolmaslik".
 *
 * O'zgartirish uchun frontend/.env faylida:
 *   VITE_ADMIN_LOGIN_PATH=/mening-maxfiy-yolim
 *
 * Muhim: bu yo'lni o'zgartirganda uni hech qayerda ochiq ko'rsatmang
 * (masalan sitemap.xml, robots.txt, yoki footer'da). Faqat administrator
 * o'zi to'g'ridan-to'g'ri manzilga kirib ishlatishi kerak.
 */
export const ADMIN_LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/bmg-panel-kirish';
