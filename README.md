# BMG School — Frontend

React 18 + Vite + Tailwind CSS bilan qurilgan public sayt va admin panel.

## Texnologiyalar

- **React 18** + React Router 6
- **Tailwind CSS** — chuqur indigo (#0F1B3D) + oltin (#E8A94C) dizayn tizimi
- **Zustand** — auth va test holati uchun state management
- **Framer Motion** — animatsiyalar
- **Recharts** — admin dashboard grafiklari
- **Axios** — API so'rovlari

## O'rnatish

```bash
cd frontend
npm install
cp .env.example .env
# .env faylida VITE_API_URL backend manzilingizga mos kelishini tekshiring
```

## Ishga tushirish

```bash
npm run dev       # development server (http://localhost:5173)
npm run build     # production build (dist/ papkasiga)
npm run preview   # build natijasini lokal ko'rish
```

**Muhim:** backend avval ishga tushgan bo'lishi kerak (`cd ../backend && npm run dev`), aks holda barcha ma'lumot so'rovlari xato beradi.

## Loyiha tuzilishi

```
src/
├── components/
│   ├── layout/       → Header, Footer
│   ├── home/         → Bosh sahifa bo'limlari (Hero, CoursesPreview, WhyUs...)
│   ├── test/          → Placement test komponentlari
│   ├── application/   → Ariza formasi
│   ├── admin/          → Admin panel uchun umumiy komponentlar (Modal, Sidebar...)
│   └── shared/         → Button, CefrFoundation (signature komponent), AiChatWidget
├── pages/              → Har bir route uchun sahifa
│   └── admin/          → Admin panel sahifalari
├── layouts/            → PublicLayout, AdminLayout
├── services/           → Backend API bilan ishlash (axios)
├── store/              → Zustand store'lar (auth, test)
└── utils/              → Formatlash funksiyalari
```

## Dizayn tizimi

Rang palitrasi `tailwind.config.js`da aniqlangan:
- `ink-*` — asosiy chuqur indigo (fon, matn)
- `gold-*` — urg'u rangi (CTA tugmalar, aksentlar)
- `slate-*` — neytral matn/fon

Signature komponent — `CefrFoundation` (`src/components/shared/CefrFoundation.jsx`) — CEFR darajalarini "poydevor" ko'rinishida ko'rsatadi, bosh sahifa va test natijasida ishlatiladi.

## Marshrutlar (Routes)

| Yo'l | Sahifa |
|---|---|
| `/` | Bosh sahifa |
| `/kurslar` | Kurslar ro'yxati |
| `/kurslar/:slug` | Kurs detali |
| `/biz-haqimizda` | Biz haqimizda |
| `/aloqa` | Aloqa + FAQ |
| `/test` | Darajani aniqlash testi |
| `/admin/login` | Admin kirish |
| `/admin/*` | Admin panel (himoyalangan) |

## Deploy (Vercel tavsiya etiladi)

1. GitHub repo yarating, kodni push qiling
2. Vercel'da yangi loyiha, `frontend/` papkasini root sifatida belgilang
3. Environment variable: `VITE_API_URL` = backend'ning production manzili
4. Deploy

Build buyrug'i: `npm run build`, chiqish papkasi: `dist`
