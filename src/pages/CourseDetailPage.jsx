import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseIcon } from '../utils/courseIcons';
import { ArrowLeft, Clock, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { getCourseBySlug } from '../services/contentService';
import { LoadingSpinner } from '../components/shared/Common';
import { formatPrice, calculateDiscountPercent, CEFR_DISPLAY } from '../utils/formatters';
import Button from '../components/shared/Button';

function CourseIcon({ name, className }) {
  const IconComponent = getCourseIcon(name);
  return <IconComponent className={className} />;
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getCourseBySlug(slug)
      .then(setCourse)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h1 className="text-2xl font-display font-semibold text-ink-900 mb-3">
          Kurs topilmadi
        </h1>
        <p className="text-slate-500 mb-6">Ehtimol bu kurs o'chirilgan yoki manzil noto'g'ri.</p>
        <Button to="/kurslar" variant="outline">Barcha kurslarga qaytish</Button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      <div className="bg-ink-900 pt-12 pb-16 px-6 md:px-10 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="container-wide relative z-10">
          <button
            onClick={() => navigate('/kurslar')}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kurslarga qaytish
          </button>

          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gold-400 flex items-center justify-center flex-shrink-0">
              <CourseIcon name={course.icon_name} className="w-8 h-8 text-ink-900" />
            </div>
            <div>
              <span className="inline-block text-xs font-semibold text-gold-300 bg-white/10 px-3 py-1 rounded-full mb-3">
                {CEFR_DISPLAY[course.cefr_level_from]} — {CEFR_DISPLAY[course.cefr_level_to]}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-white text-balance">
                {course.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide px-6 md:px-10 lg:px-16 mt-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="font-display font-semibold text-xl text-ink-900 mb-3">Kurs haqida</h2>
            <p className="text-slate-600 leading-relaxed mb-8">{course.description}</p>

            {course.teacher_name && (
              <div className="bg-slate-50 rounded-2xl p-6 flex items-center gap-4">
                {course.teacher_photo_url ? (
                  <img
                    src={course.teacher_photo_url}
                    alt={course.teacher_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-ink-900 flex items-center justify-center text-gold-400 font-display font-semibold">
                    {course.teacher_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">O'qituvchi</p>
                  <p className="font-semibold text-ink-900">{course.teacher_name}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-ink-900/5 p-7 self-start">
            {course.original_price && Number(course.original_price) > Number(course.price_amount) && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(course.original_price)}
                </span>
                <span className="text-xs font-bold text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full">
                  -{calculateDiscountPercent(course.original_price, course.price_amount)}%
                </span>
              </div>
            )}
            <p className="font-display font-semibold text-2xl text-ink-900 mb-1">
              {formatPrice(course.price_amount)}
              <span className="text-sm text-slate-400 font-sans">
                {course.price_period === 'oylik' ? ' /oy' : ' /kurs'}
              </span>
            </p>
            <p className="text-xs text-slate-400 mb-6">To'lov tartibi bo'yicha aniqlashtirish uchun bog'laning</p>

            <div className="flex flex-col gap-3 mb-7">
              <DetailRow icon={Calendar} label="Davomiyligi" value={`${course.duration_months} oy`} />
              <DetailRow icon={Clock} label="Haftada" value={`${course.lessons_per_week} marta dars`} />
              {course.group_size_max && (
                <DetailRow icon={Users} label="Guruh hajmi" value={`${course.group_size_max} kishigacha`} />
              )}
            </div>

            <Button to="/test" className="w-full !justify-center">
              <CheckCircle2 className="w-4 h-4" />
              Darajangizni aniqlab, ariza qoldiring
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-slate-500">
        <Icon className="w-4 h-4" />
        {label}
      </span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
