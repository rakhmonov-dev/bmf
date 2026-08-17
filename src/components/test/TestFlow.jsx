import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTestQuestions, submitTest } from '../../services/testService';
import { useTestStore } from '../../store/testStore';
import { LoadingSpinner } from '../shared/Common';
import TestQuestionCard from './TestQuestionCard';
import TestProgressBar from './TestProgressBar';
import TestResultView from './TestResultView';

/**
 * To'liq test oqimi: savollarni yuklash → javob olish → yuborish → natija.
 * Bu komponent ham /test sahifasida (TestPage), ham Hero ichidagi inline
 * widget'da (HeroTestWidget) bir xil ishlaydi — biznes mantiq bir joyda
 * saqlanadi, faqat atrofdagi konteyner (padding, fon) chaqiruvchi tomonda
 * belgilanadi.
 *
 * @param {boolean} compact - true bo'lsa, kichikroq padding va shrift
 *   o'lchami ishlatiladi (Hero ichidagi tor widget uchun mos).
 * @param {Function} onClose - agar berilsa, yopish tugmasi ko'rsatiladi
 *   (Hero ichidagi modal holatida foydalanuvchi testni bekor qilishi uchun).
 */
export default function TestFlow({ compact = false, onClose = null }) {
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const {
    questions,
    currentQuestionIndex,
    answers,
    result,
    setQuestions,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    getAnswersArray,
    setResult,
    resetTest,
  } = useTestStore();

  useEffect(() => {
    resetTest();
    getTestQuestions()
      .then(setQuestions)
      .catch(() => setLoadError(true))
      .finally(() => setIsLoadingQuestions(false));
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = currentQuestion && answers[currentQuestion.id] !== undefined;
  const answeredCount = Object.keys(answers).length;

  async function handleSubmit() {
    if (answeredCount < questions.length) {
      toast.error("Iltimos, barcha savollarga javob bering.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitTest(getAnswersArray());
      setResult(result);
    } catch (error) {
      toast.error(error.response?.data?.message || "Test topshirishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingQuestions) {
    return <LoadingSpinner label="Test tayyorlanmoqda..." />;
  }

  if (loadError || questions.length === 0) {
    return (
      <div className="text-center max-w-md mx-auto px-6 py-10">
        <h2 className="text-xl font-display font-semibold text-ink-900 mb-3">
          Test hozircha mavjud emas
        </h2>
        <p className="text-slate-500">
          Iltimos, birozdan keyin qayta urinib ko'ring yoki biz bilan bog'laning.
        </p>
      </div>
    );
  }

  if (result) {
    return <TestResultView result={result} compact={compact} onClose={onClose} />;
  }

  return (
    <div>
      <div className="mb-6">
        <TestProgressBar current={currentQuestionIndex} total={questions.length} />
      </div>

      <TestQuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedOption={answers[currentQuestion.id]}
        onSelect={(option) => answerQuestion(currentQuestion.id, option)}
        compact={compact}
      />

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:text-ink-900 transition-colors px-4 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Oldingi
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnsweredCurrent || isSubmitting}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-40 text-ink-900 font-semibold text-sm px-6 py-3 rounded-full transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              <>
                Testni yakunlash
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={!hasAnsweredCurrent}
            className="inline-flex items-center gap-1.5 bg-ink-900 hover:bg-ink-800 disabled:opacity-30 text-white font-medium text-sm px-6 py-3 rounded-full transition-all"
          >
            Keyingisi
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
