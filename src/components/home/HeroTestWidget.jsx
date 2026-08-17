import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ArrowRight, X, GraduationCap, BookOpen } from 'lucide-react';
import TestFlow from '../test/TestFlow';
import { useTestStore } from '../../store/testStore';

/**
 * Hero ichidagi interaktiv test widget'i. Boshlang'ich holatda jozibali
 * taklif kartasi ko'rsatiladi; bosilganda xuddi shu joyning o'zida (Hero
 * ichida, /test sahifasiga o'tmasdan) to'liq 15 savollik test ochiladi.
 *
 * Ochiq holatdagi panel ataylab to'q rangli "sarlavha" chizig'i bilan
 * boshlanadi (oddiy oq to'rtburchak emas) — bu Hero'ning to'q fonidan
 * to'satdan oq blokka sakrab o'tishning oldini oladi va butun widget
 * bir butun sifatida ko'rinadi.
 */
export default function HeroTestWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const resetTest = useTestStore((s) => s.resetTest);

  function handleClose() {
    setIsOpen(false);
    resetTest();
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="invite"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="group relative w-full text-left bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/20 overflow-hidden"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-gold-400/25 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gold-400/20 rounded-full blur-3xl group-hover:bg-gold-400/30 transition-colors duration-500" />
            <div className="absolute -bottom-20 -left-16 w-40 h-40 bg-ink-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold-400 flex items-center justify-center mb-5 shadow-lg shadow-gold-400/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <GraduationCap className="w-8 h-8 text-ink-900" strokeWidth={2.2} />
              </div>

              <div className="inline-flex items-center gap-1.5 bg-gold-400/15 text-gold-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <Sparkles className="w-3 h-3" />
                15 savol · 5 daqiqa
              </div>

              <h3 className="font-display font-semibold text-2xl text-white mb-2 text-balance">
                Ingliz tili darajangizni bilib oling
              </h3>
              <p className="text-slate-400 text-sm mb-1 max-w-xs">
                Bepul test orqali CEFR darajangizni aniqlang va mos kursni toping
              </p>
              <p className="flex items-center gap-1.5 text-gold-300/90 text-xs font-medium mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                + bepul PDF kitob sovg'a
              </p>

              <div className="inline-flex items-center gap-2 bg-gold-400 group-hover:bg-gold-300 text-ink-900 font-semibold px-6 py-3 rounded-full transition-all group-hover:scale-105 shadow-lg shadow-gold-400/25">
                Testni boshlash
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="test"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10 max-h-[78vh] overflow-hidden flex flex-col"
          >
            {/* To'q rangli sarlavha chizig'i — Hero foni bilan uzluksiz
                o'tish hosil qiladi, oq panel to'satdan paydo bo'lmaydi */}
            <div className="bg-ink-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold-400 flex items-center justify-center">
                  <GraduationCap className="w-4.5 h-4.5 text-ink-900" strokeWidth={2.2} />
                </div>
                <span className="text-white text-sm font-medium">Daraja aniqlash testi</span>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Testni yopish"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">
              <TestFlow compact onClose={handleClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
