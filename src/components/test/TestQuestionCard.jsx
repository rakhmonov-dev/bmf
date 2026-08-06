import { motion, AnimatePresence } from 'framer-motion';

const OPTION_LABELS = { a: 'A', b: 'B', c: 'C', d: 'D' };

export default function TestQuestionCard({ question, questionNumber, totalQuestions, selectedOption, onSelect }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-ink-900/5 p-8 md:p-10"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
            {question.cefr_level}
          </span>
          <span className="text-sm text-slate-400">
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-display font-semibold text-ink-900 mb-8 text-balance">
          {question.question_text}
        </h2>

        <div className="flex flex-col gap-3">
          {['a', 'b', 'c', 'd'].map((optionKey) => {
            const optionText = question[`option_${optionKey}`];
            const isSelected = selectedOption === optionKey;

            return (
              <button
                key={optionKey}
                onClick={() => onSelect(optionKey)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-gold-400 bg-gold-50'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                    isSelected ? 'bg-gold-400 text-ink-900' : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {OPTION_LABELS[optionKey]}
                </span>
                <span className={`text-sm ${isSelected ? 'text-ink-900 font-medium' : 'text-slate-600'}`}>
                  {optionText}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
