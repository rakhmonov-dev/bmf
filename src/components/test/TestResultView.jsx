import { useState } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, ArrowRight } from 'lucide-react';
import CefrFoundation from '../shared/CefrFoundation';
import { CEFR_DISPLAY } from '../../utils/formatters';
import ApplicationForm from '../application/ApplicationForm';

/**
 * Natija ko'rinishi endi o'z sahifa konteynerini yaratmaydi (pt-32,
 * min-h-screen va h.k.) — bu chaqiruvchi tomonda belgilanadi. Shu tufayli
 * bir xil komponent /test sahifasida ham, Hero ichidagi kompakt widget'da
 * ham to'g'ri ko'rinadi.
 */
export default function TestResultView({ result, compact = false, onClose = null }) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (showApplicationForm) {
    return <ApplicationForm testResult={result} compact={compact} onClose={onClose} />;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center ${compact ? 'mb-6' : 'mb-10'}`}
      >
        <div className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <PartyPopper className="w-3.5 h-3.5" />
          Test yakunlandi
        </div>
        <h1 className={`font-display font-semibold text-ink-900 mb-3 ${compact ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>
          Sizning darajangiz: {CEFR_DISPLAY[result.determinedLevel]}
        </h1>
        <p className="text-slate-500 text-sm">
          Siz {result.maxScore} savoldan {result.score} tasiga to'g'ri javob berdingiz
          ({result.percentage}%)
        </p>
      </motion.div>

      <div className={`bg-white rounded-2xl border border-slate-100 shadow-xl shadow-ink-900/5 ${compact ? 'p-5 md:p-6 mb-6' : 'p-8 md:p-12 mb-10'}`}>
        <CefrFoundation highlightLevel={result.determinedLevel} compact={compact} />
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowApplicationForm(true)}
          className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold-400/20"
        >
          Kursga yozilish uchun ariza qoldirish
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
