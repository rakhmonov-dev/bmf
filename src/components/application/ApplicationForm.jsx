import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CheckCircle2, Loader2, BookOpen } from 'lucide-react';
import { getCourses } from '../../services/contentService';
import { submitApplication } from '../../services/testService';
import { CEFR_DISPLAY } from '../../utils/formatters';
import { useTestStore } from '../../store/testStore';

/**
 * Konteynersiz — chaqiruvchi (TestPage yoki HeroTestWidget) o'z padding/fon
 * sozlamalarini ta'minlaydi. `compact` kichikroq shrift/bo'shliq beradi,
 * `onClose` berilsa (Hero modal holatida) yopish tugmasi ko'rsatiladi.
 */
export default function ApplicationForm({ testResult = null, compact = false, onClose = null }) {
  const [courses, setCourses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resetTest = useTestStore((s) => s.resetTest);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    telegramUsername: '',
    courseId: '',
    preferredTime: '',
    comment: '',
  });

  useEffect(() => {
    getCourses().then(setCourses).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitApplication({
        ...formData,
        age: Number(formData.age),
        courseId: formData.courseId ? Number(formData.courseId) : null,
        testAttemptId: testResult?.attemptId || null,
        testScore: testResult?.score ?? null,
        determinedLevel: testResult?.determinedLevel || null,
      });
      setIsSubmitted(true);
      resetTest();
    } catch (error) {
      toast.error(error.response?.data?.message || "Ariza yuborishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center ${compact ? 'py-8' : 'py-16'}`}
      >
        <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-gold-500" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-ink-900 mb-3">
          Arizangiz qabul qilindi!
        </h2>
        <p className="text-slate-500 leading-relaxed">
          Tez orada administratorlarimiz siz bilan bog'lanadi. Vaqtingizni ajratganingiz
          uchun rahmat.
        </p>
        <div className="inline-flex items-center gap-2 bg-gold-50 text-gold-700 text-sm font-medium px-4 py-2.5 rounded-full mt-5">
          <BookOpen className="w-4 h-4" />
          Darajangizga mos PDF kitob Telegram'ingizga yuboriladi
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-800 text-white font-medium px-6 py-2.5 rounded-full transition-colors text-sm"
          >
            Yopish
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative">
      <div className={compact ? 'mb-6' : 'mb-10'}>
        <h2 className={`font-display font-semibold text-ink-900 mb-2 ${compact ? 'text-xl' : 'text-3xl'}`}>
          Ariza qoldiring
        </h2>
        <p className="text-slate-500 text-sm">Bir necha ma'lumot to'ldiring — administratorlarimiz bog'lanadi</p>
      </div>

      {testResult && (
        <div className="bg-ink-900 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between">
          <span className="text-slate-300 text-sm">Test natijasi</span>
          <span className="text-gold-400 font-display font-semibold">
            {testResult.subject === 'math' ? testResult.determinedLevel : CEFR_DISPLAY[testResult.determinedLevel]}
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-2xl border border-slate-100 shadow-xl shadow-ink-900/5 flex flex-col gap-4 ${compact ? 'p-5' : 'p-8'}`}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ism familiya *">
            <input
              required
              value={formData.fullName}
              onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
              className="input-base"
            />
          </Field>
          <Field label="Yosh *">
            <input
              required
              type="number"
              min={5}
              max={100}
              value={formData.age}
              onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
              className="input-base"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Telefon raqami *">
            <input
              required
              placeholder="+998 90 123 45 67"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              className="input-base"
            />
          </Field>
          <Field label="Telegram username">
            <input
              placeholder="@username"
              value={formData.telegramUsername}
              onChange={(e) => setFormData((p) => ({ ...p, telegramUsername: e.target.value }))}
              className="input-base"
            />
            <p className="text-xs text-gold-600 mt-1.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Darajangizga mos bepul PDF kitob shu manzilga yuboriladi
            </p>
          </Field>
        </div>

        <Field label="Qiziqtirgan kurs">
          <select
            value={formData.courseId}
            onChange={(e) => setFormData((p) => ({ ...p, courseId: e.target.value }))}
            className="input-base"
          >
            <option value="">Tanlanmagan</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Qulay vaqt">
          <input
            placeholder="Masalan: Kunduzi, 15:00-18:00"
            value={formData.preferredTime}
            onChange={(e) => setFormData((p) => ({ ...p, preferredTime: e.target.value }))}
            className="input-base"
          />
        </Field>

        <Field label="Izoh">
          <textarea
            rows={3}
            value={formData.comment}
            onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
            className="input-base resize-none"
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-ink-900 font-semibold py-4 rounded-full transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Yuborilmoqda...
            </>
          ) : (
            'Arizani yuborish'
          )}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
