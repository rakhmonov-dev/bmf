import { motion } from 'framer-motion';

const LEVELS = [
  { code: 'Boshlangich', label: "Boshlang'ich", width: 100, description: 'Nol bilimdan boshlash' },
  { code: 'A1', label: 'A1', width: 92, description: 'Oddiy iboralar va tanishuv' },
  { code: 'A2', label: 'A2', width: 84, description: 'Kundalik muloqot' },
  { code: 'B1', label: 'B1', width: 76, description: 'Erkin fikr almashish' },
  { code: 'B2', label: 'B2', width: 68, description: 'Murakkab mavzularni tushunish' },
  { code: 'C1', label: 'C1', width: 58, description: 'Professional erkinlik' },
];

/**
 * CEFR darajalarini "poydevor" ko'rinishida ko'rsatadi — pastdan yuqoriga
 * qurilgan holda, checklist yoki "01/02/03" raqamli belgilardan farqli.
 * Har bir qatlam avvalgisidan tor va och rangdan to'qroqqa o'tadi,
 * "yuqoriga ko'tarilish" hissi beradi.
 *
 * @param {string} highlightLevel - agar berilsa, shu darajagacha bo'lgan
 *   barcha qatlamlar to'liq rangda, undan yuqoridagilar xira ko'rsatiladi
 *   (test natijasini ko'rsatish uchun ishlatiladi)
 */
export default function CefrFoundation({ highlightLevel = null, compact = false }) {
  const highlightIndex = highlightLevel
    ? LEVELS.findIndex((l) => l.code === highlightLevel)
    : LEVELS.length - 1;

  return (
    <div className={`flex flex-col items-center ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {LEVELS.slice().reverse().map((level, reversedIdx) => {
        const idx = LEVELS.length - 1 - reversedIdx;
        const isActive = idx <= highlightIndex;
        const isTopActive = idx === highlightIndex;

        return (
          <motion.div
            key={level.code}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: reversedIdx * 0.08, duration: 0.4 }}
            style={{ width: `${level.width}%` }}
            className="w-full"
          >
            <div
              className={`
                relative flex items-center justify-between
                ${compact ? 'px-4 py-2.5' : 'px-6 py-3.5'}
                rounded-lg transition-all duration-500
                ${
                  isActive
                    ? isTopActive
                      ? 'bg-gold-400 shadow-lg shadow-gold-400/30'
                      : 'bg-ink-800'
                    : 'bg-slate-100'
                }
              `}
            >
              <span
                className={`font-display font-semibold ${compact ? 'text-sm' : 'text-base'} ${
                  isActive ? (isTopActive ? 'text-ink-900' : 'text-white') : 'text-slate-400'
                }`}
              >
                {level.label}
              </span>
              {!compact && (
                <span
                  className={`text-xs ${
                    isActive ? (isTopActive ? 'text-ink-800' : 'text-slate-300') : 'text-slate-400'
                  }`}
                >
                  {level.description}
                </span>
              )}
              {isTopActive && highlightLevel && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-ink-900 border-2 border-gold-400 flex items-center justify-center"
                >
                  <span className="text-gold-400 text-[10px]">✓</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
