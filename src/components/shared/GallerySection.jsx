import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  AnimatePresence, motion, useMotionValue, useSpring, useTransform, useAnimationFrame,
} from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, Images,
  Smile, BookOpenCheck, TrendingUp, Trophy, PlayCircle,
} from 'lucide-react';
import { getGalleryImages } from '../../services/contentService';
import { LoadingSpinner } from './Common';

// Har bir slayd shu vaqt davomida ko'rsatiladi (talab: 2000ms)
const AUTOPLAY_MS = 3000;
// Fon gradienti kategoriya almashganda shuncha vaqt davomida bir-biriga
// eriydi (crossfade) — talabga ko'ra kamida 800-1000ms
const BG_CROSSFADE_MS = 950;

/**
 * Kategoriyalarning ko'rinish tartibi va ikonalari. "Jarayon" ataylab bu
 * ro'yxatda yo'q — u alohida, HowItWorksSection komponentida ko'rsatiladi.
 */
const PREFERRED_CATEGORY_ORDER = ['Funny', 'Dars jarayoni', "O'quvchilar natijasi", 'Olimpiada'];
// Maxsus maqsadli kategoriyalar — bular boshqa komponentlarda (HowItWorksSection,
// PricingSection) alohida ishlatiladi va umumiy galereya tab tizimida
// ko'rsatilmasligi kerak. Yangi maxsus kategoriya qo'shsangiz, shu ro'yxatga
// ham qo'shing — aks holda u tasodifan umumiy tab'larda paydo bo'lib qoladi.
const SPECIAL_PURPOSE_CATEGORIES = new Set([
  'Jarayon-1', 'Jarayon-2', 'Jarayon-3', 'Kurslar-banner',
]);

const CATEGORY_ICONS = {
  Funny: Smile,
  'Dars jarayoni': BookOpenCheck,
  "O'quvchilar natijasi": TrendingUp,
  Olimpiada: Trophy,
};

const CATEGORY_ACCENT = {
  Funny: 'bg-coral-500',
  'Dars jarayoni': 'bg-ink-800',
  "O'quvchilar natijasi": 'bg-emerald-600',
  Olimpiada: 'bg-gold-500',
};

function getAccent(category) {
  return CATEGORY_ACCENT[category] || 'bg-slate-600';
}

// Har bir kategoriya uchun "hero" fon palitrasi: gradient (asosiy fon),
// blobs (aurora doiralarining rangi, eng ochig'idan eng to'qigacha) va
// accentSolidHex (progress-bar/thumbnail urg'usi uchun). Ranglar
// tailwind.config.js'dagi ink/gold/coral/emerald palitrasidan olingan —
// shu sababli bu yerda inline style sifatida ishlatiladi (Tailwind dinamik
// class nomini build vaqtida generatsiya qilolmaydi).
const CATEGORY_THEME = {
  Funny: {
    gradient: 'linear-gradient(135deg, #FF9C85 0%, #F5573A 48%, #8A2415 100%)',
    blobs: ['#FF7A5C', '#FFC2B3', '#D93F24'],
    accentSolidHex: '#F5573A',
  },
  'Dars jarayoni': {
    gradient: 'linear-gradient(135deg, #374374 0%, #1A2247 55%, #0A1229 100%)',
    blobs: ['#57679D', '#374374', '#1A2247'],
    accentSolidHex: '#57679D',
  },
  "O'quvchilar natijasi": {
    gradient: 'linear-gradient(135deg, #6EE7B7 0%, #10B981 50%, #065F46 100%)',
    blobs: ['#34D399', '#6EE7B7', '#059669'],
    accentSolidHex: '#10B981',
  },
  Olimpiada: {
    gradient: 'linear-gradient(135deg, #F4D394 0%, #E8A94C 48%, #8F5A20 100%)',
    blobs: ['#EDBC5D', '#F4D394', '#B3752A'],
    accentSolidHex: '#E8A94C',
  },
};
const DEFAULT_THEME = {
  gradient: 'linear-gradient(135deg, #4D5470 0%, #282C40 60%, #1A1D2B 100%)',
  blobs: ['#666D8C', '#4D5470', '#282C40'],
  accentSolidHex: '#4D5470',
};

function getTheme(category) {
  return CATEGORY_THEME[category] || DEFAULT_THEME;
}

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Nozik harakatlarni (tilt, aurora, ken burns) foydalanuvchi tizim
  // darajasida "kamroq animatsiya" so'ragan bo'lsa o'chiramiz
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // Tilt effekti faqat sichqoncha bilan aniq boshqariladigan qurilmalarda
  // ishlaydi — mobil/touch'da hisoblash behuda va tebranish beradi
  const [canTilt, setCanTilt] = useState(false);

  const autoplayRef = useRef(null);
  const touchResumeRef = useRef(null);
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    getGalleryImages()
      .then(setImages)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setPrefersReducedMotion(motionQuery.matches);
    setCanTilt(hoverQuery.matches);
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    const handleHoverChange = (e) => setCanTilt(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    hoverQuery.addEventListener('change', handleHoverChange);
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      hoverQuery.removeEventListener('change', handleHoverChange);
    };
  }, []);

  const categories = useMemo(() => {
  const found = new Set(
    images
      .map((img) => img.category || 'Kategoriyasiz')
      .filter((cat) => !SPECIAL_PURPOSE_CATEGORIES.has(cat))
  );

  const ordered = PREFERRED_CATEGORY_ORDER.filter((cat) => found.has(cat));

  const extras = [...found].filter(
    (cat) => !PREFERRED_CATEGORY_ORDER.includes(cat)
  );

  return [...ordered, ...extras];
}, [images]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const activeImages = useMemo(
  () =>
    images.filter((img) => {
      if (activeCategory === 'Kategoriyasiz') {
        return !img.category;
      }

      return img.category === activeCategory;
    }),
  [images, activeCategory]
);

  // Kategoriya almashsa, slaydshouni boshiga qaytaramiz
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const goTo = useCallback((idx) => {
    if (!activeImages.length) return;
    const clamped = (idx + activeImages.length) % activeImages.length;
    setActiveIndex(clamped);
  }, [activeImages.length]);

  // Avtomatik aylanish — sichqoncha ustida, teginilganda yoki lightbox
  // ochiq bo'lganda to'xtaydi. Video slaydlar bunga kirmaydi — ular
  // pastdagi <video onEnded> orqali o'zi tugagach keyingisiga o'tadi,
  // shu bilan video hech qachon kesilmasdan to'liq ko'rsatiladi.
  const currentMediaType = activeImages[activeIndex]?.media_type;

  useEffect(() => {
    if (isPaused || lightboxOpen || activeImages.length <= 1) return;
    if (currentMediaType === 'video') return;

    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeImages.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(autoplayRef.current);
  }, [isPaused, lightboxOpen, activeImages.length, currentMediaType]);

  // Video slayd sichqoncha hover/teginish/lightbox tufayli "pauza"
  // qilinganda, haqiqiy video ijrosi ham to'xtaydi (aks holda video orqa
  // fonda ijro bo'lib, keyin foydalanuvchi bilmagan holda tugab ketardi)
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    if (isPaused || lightboxOpen) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
  }, [isPaused, lightboxOpen, activeIndex]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') goTo(activeIndex + 1);
      if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeIndex, goTo]);

  function openLightbox(idx) {
    goTo(idx);
    setLightboxOpen(true);
  }

  function handleTouchStart() {
    setIsPaused(true);
    if (touchResumeRef.current) clearTimeout(touchResumeRef.current);
  }

  function handleTouchEnd() {
    touchResumeRef.current = setTimeout(() => setIsPaused(false), 1200);
  }

  // ---- Progress-bar (rAF orqali, React state'ni har freymda qayta
  // render qilmasdan — motion value orqali to'g'ridan-to'g'ri DOM'ga
  // yoziladi, shu bilan mobilda ham silliq va yengil ishlaydi) ----
  const progressValue = useMotionValue(0);
  const progressWidth = useTransform(progressValue, (v) => `${v}%`);
  const progressStartRef = useRef(null);
  const progressElapsedRef = useRef(0);

  useEffect(() => {
    progressElapsedRef.current = 0;
    progressStartRef.current = null;
    progressValue.set(0);
  }, [activeIndex, activeCategory, progressValue]);

  useAnimationFrame((time) => {
    if (isPaused || lightboxOpen || activeImages.length <= 1 || currentMediaType === 'video') {
      progressStartRef.current = null;
      return;
    }
    if (progressStartRef.current === null) {
      progressStartRef.current = time - progressElapsedRef.current;
    }
    const elapsed = time - progressStartRef.current;
    progressElapsedRef.current = elapsed;
    progressValue.set(Math.min(100, (elapsed / AUTOPLAY_MS) * 100));
  });

  // ---- Fon gradientining "chuqurlik hissi beruvchi" crossfade animatsiyasi
  // Kategoriya almashganda ikkita qatlam bir-biriga o'tadi (opacity fade),
  // rasm o'zgarishidan ozgina kechikib boshlanadi (transition-delay) —
  // shu bilan fon "orqada qolib, keyin yetib oladi" degan chuqurlik hissini
  // beradi. Diqqat: bitta tab (kategoriya) ichida barcha rasmlar bir xil
  // kategoriyaga tegishli bo'lgani uchun, fon rangi har bir alohida rasm
  // almashganda emas, balki kategoriya (tab) o'zgarganda to'liq almashadi;
  // rasm almashganda esa quyidagi aurora bloblar orqali "nafas olish"
  // effekti bilan reaktivlik hissi beriladi.
  const initialTheme = getTheme(activeCategory);
  const [bgLayerA, setBgLayerA] = useState(initialTheme.gradient);
  const [bgLayerB, setBgLayerB] = useState(initialTheme.gradient);
  const [topIsA, setTopIsA] = useState(true);

  useEffect(() => {
    const nextGradient = getTheme(activeCategory).gradient;
    if (topIsA) {
      setBgLayerB(nextGradient);
    } else {
      setBgLayerA(nextGradient);
    }
    const rafId = requestAnimationFrame(() => setTopIsA((v) => !v));
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // ---- Kartaga 3D tilt (sichqoncha pozitsiyasiga qarab yengil egilish) ----
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 220, damping: 22, mass: 0.6 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 220, damping: 22, mass: 0.6 });

  function handleHeroMouseMove(e) {
    if (!canTilt || prefersReducedMotion || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYRaw.set(px * 8);
    rotateXRaw.set(py * -8);
  }

  function handleHeroMouseLeave() {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    setIsPaused(false);
  }

  if (isLoading) {
    return (
      <div className="container-wide px-6 md:px-10 lg:px-16 mt-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (categories.length === 0) return null;

  const currentImage = activeImages[activeIndex];
  const accent = getAccent(activeCategory);
  const theme = getTheme(activeCategory);
  const CategoryIcon = CATEGORY_ICONS[activeCategory] || Images;

  return (
    <section className="section-padding bg-coral-50">
      <div className="container-wide">
        <div className="text-center mb-10">
          <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest mb-3 block">
            Hayotimizdan lavhalar
          </span>
          <h2 className="text-3xl font-display font-semibold text-ink-900 mb-3 flex items-center justify-center gap-2.5">
            <Images className="w-7 h-7 text-gold-500" />
            Galereya
          </h2>
          <p className="text-slate-500">Darslarimiz va o'quvchilarimizning muvaffaqiyatlaridan lavhalar</p>
        </div>

        {/* Kategoriya filtri — ixcham segment-uslubidagi tugmalar */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/80 border border-white shadow-sm">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Images;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-500 hover:text-ink-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="gallery-pill-bg"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className={`absolute inset-0 rounded-xl ${getAccent(cat)}`}
                    />
                  )}
                  <Icon className="relative w-3.5 h-3.5" />
                  <span className="relative">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero-darajadagi slayd-shou */}
        {activeImages.length > 0 && currentImage && (
          <div className="relative isolate max-w-6xl mx-auto">
            {/* Fon: gradient crossfade + aurora bloblar */}
            <div className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-10 sm:-inset-y-10 rounded-[2.5rem] overflow-hidden -z-10 pointer-events-none">
              <div
                style={{
                  background: bgLayerA,
                  opacity: topIsA ? 1 : 0,
                  transitionProperty: 'opacity',
                  transitionDuration: `${BG_CROSSFADE_MS}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '150ms',
                }}
                className="absolute inset-0"
              />
              <div
                style={{
                  background: bgLayerB,
                  opacity: topIsA ? 0 : 1,
                  transitionProperty: 'opacity',
                  transitionDuration: `${BG_CROSSFADE_MS}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '150ms',
                }}
                className="absolute inset-0"
              />

              {!prefersReducedMotion && (
                <>
                  <motion.div
                    className="absolute -top-10 -left-10 w-72 h-72 md:w-96 md:h-96 rounded-full blur-2xl md:blur-3xl mix-blend-screen opacity-60 will-change-transform"
                    style={{ backgroundColor: theme.blobs[0], transition: 'background-color 1s ease-in-out' }}
                    animate={{ x: [0, 50, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.95, 1] }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute -bottom-16 -right-10 w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-full blur-2xl md:blur-3xl mix-blend-screen opacity-50 will-change-transform"
                    style={{ backgroundColor: theme.blobs[1], transition: 'background-color 1s ease-in-out' }}
                    animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="hidden md:block absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl mix-blend-screen opacity-40 will-change-transform"
                    style={{ backgroundColor: theme.blobs[2], transition: 'background-color 1s ease-in-out' }}
                    animate={{ x: [0, 30, -30, 0], y: [0, -25, 15, 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </>
              )}
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Hero karta */}
            <div
              ref={heroRef}
              role="button"
              tabIndex={0}
              aria-label="Kattalashtirib ko'rish"
              onMouseMove={handleHeroMouseMove}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={handleHeroMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => openLightbox(activeIndex)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openLightbox(activeIndex);
              }}
              style={{ rotateX, rotateY, transformPerspective: 1400 }}
              className="group relative w-full aspect-[4/5] sm:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl shadow-ink-950/50 ring-1 ring-white/10 cursor-pointer will-change-transform"
            >
              {/* Letterbox foni — rasm object-contain bo'lgani uchun bo'sh
                  qolgan chekkalarni tekis, blursiz rang bilan to'ldiradi */}
              <div className="absolute inset-0 bg-ink-950" />

              {/* Asosiy rasm/video — Ken Burns zoom + crossfade */}
              <AnimatePresence>
                <motion.div
                  key={`${currentImage.id}-${activeIndex}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                  {currentImage.media_type === 'video' ? (
                    <video
                      ref={heroVideoRef}
                      key={currentImage.id}
                      src={currentImage.image_url}
                      muted
                      playsInline
                      autoPlay
                      onTimeUpdate={(e) => {
                        const v = e.currentTarget;
                        if (v.duration) progressValue.set((v.currentTime / v.duration) * 100);
                      }}
                      onEnded={() => goTo(activeIndex + 1)}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <motion.img
                      src={currentImage.image_url}
                      alt={currentImage.caption || activeCategory}
                      initial={{ scale: 1 }}
                      animate={{ scale: prefersReducedMotion ? 1 : 1.03 }}
                      transition={{ duration: AUTOPLAY_MS / 1000 + 1.2, ease: 'easeOut' }}
                      style={{ transformOrigin: 'center' }}
                      className="w-full h-full object-contain will-change-transform"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* O'qish uchun qorong'ulashtiruvchi gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent pointer-events-none" />

              {currentImage.media_type === 'video' && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                  <PlayCircle className="w-3.5 h-3.5" />
                  Video
                </div>
              )}

              {/* Kategoriya badge — glassmorphism + spring animatsiya bilan kirib keladi */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentImage.id}-${activeIndex}-badge`}
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 24, delay: 0.15 }}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
                >
                  <CategoryIcon className="w-3.5 h-3.5" />
                  {activeCategory}
                </motion.div>
              </AnimatePresence>

              {/* Progress-chiziq — 2 soniyalik autoplay vaqtini real vaqtda ko'rsatadi */}
              {activeImages.length > 1 && (
                <div className="absolute inset-x-0 top-0 h-1 bg-white/15 overflow-hidden z-10">
                  <motion.div
                    className="h-full origin-left"
                    style={{
                      width: progressWidth,
                      background: `linear-gradient(90deg, ${theme.blobs[0]}, ${theme.accentSolidHex})`,
                    }}
                  />
                </div>
              )}

              {/* Caption paneli — glassmorphism, pastdan sirg'alib chiqadi */}
              {currentImage.caption && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentImage.id}-${activeIndex}-caption`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
                    className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5"
                  >
                    <p className="text-white text-sm sm:text-[15px] font-medium">{currentImage.caption}</p>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Oldingi/Keyingi — shaffof (glass) tugmalar */}
              {activeImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                    aria-label="Oldingi"
                    className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 hover:scale-110 items-center justify-center transition-all z-10"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                    aria-label="Keyingi"
                    className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 hover:scale-110 items-center justify-center transition-all z-10"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Miniatyura qatori — bevosita istalgan slaydga o'tish uchun */}
            {activeImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-5 overflow-x-auto no-scrollbar px-1 py-1">
                {activeImages.map((img, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={img.id}
                      onClick={() => goTo(idx)}
                      aria-label={`${idx + 1}-rasmga o'tish`}
                      style={isActive ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${theme.accentSolidHex}` } : undefined}
                      className={`relative flex-shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden transition-all duration-300 ${
                        isActive ? 'scale-105 opacity-100' : 'opacity-45 hover:opacity-80'
                      }`}
                    >
                      {img.media_type === 'video' ? (
                        <div className="w-full h-full bg-ink-900 flex items-center justify-center">
                          <PlayCircle className="w-4 h-4 text-white/80" />
                        </div>
                      ) : (
                        <img src={img.image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Nuqta-indikatorlar */}
            {activeImages.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {activeImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => goTo(idx)}
                    aria-label={`${idx + 1}-slaydga o'tish`}
                    style={idx === activeIndex ? { backgroundColor: theme.accentSolidHex } : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex ? 'w-6' : 'w-1.5 bg-ink-900/20 hover:bg-ink-900/35'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {activeImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                  className="absolute left-4 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                  className="absolute right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              key={`${currentImage.id}-${activeIndex}-lightbox`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              {currentImage.media_type === 'video' ? (
                <video
                  src={currentImage.image_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              ) : (
                <img
                  src={currentImage.image_url}
                  alt={currentImage.caption || activeCategory}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              )}
              {currentImage.caption && (
                <p className="text-white text-sm mt-4 text-center">{currentImage.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
