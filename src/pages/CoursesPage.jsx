import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCourseIcon } from '../utils/courseIcons';
import { ArrowRight, Users, Clock, BookOpen } from 'lucide-react';
import { getCourses } from '../services/contentService';
import { LoadingSpinner, EmptyState } from '../components/shared/Common';
import { formatPrice } from '../utils/formatters';
import Button from '../components/shared/Button';

function CourseIcon({ name, className }) {
  const IconComponent = getCourseIcon(name);
  return <IconComponent className={className} />;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-20">
      <div className="container-wide px-6 md:px-10 lg:px-16">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest mb-3 block">
            Kurslarimiz
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-ink-900 mb-4 text-balance">
            Sizga mos yo'nalishni tanlang
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Boshlang'ich darajadan professional erkinlikkacha — har bir bosqich uchun
            maxsus ishlab chiqilgan dastur.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Hozircha kurslar mavjud emas"
            description="Tez orada yangi kurslar qo'shiladi."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-slate-50 rounded-2xl p-7 border border-slate-100 hover:border-gold-300 hover:shadow-xl hover:shadow-ink-900/5 transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-ink-900 flex items-center justify-center mb-5 group-hover:bg-gold-400 transition-colors">
                  <CourseIcon
                    name={course.icon_name}
                    className="w-6 h-6 text-gold-400 group-hover:text-ink-900 transition-colors"
                  />
                </div>

                <span className="inline-block text-xs font-semibold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full mb-3 w-fit">
                  {course.cefr_level_from} — {course.cefr_level_to}
                </span>

                <h3 className="font-display font-semibold text-xl text-ink-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">
                  {course.description}
                </p>

                {course.teacher_name && (
                  <p className="text-xs text-slate-400 mb-4">
                    O'qituvchi: <span className="text-slate-600 font-medium">{course.teacher_name}</span>
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration_months} oy
                  </span>
                  {course.group_size_max && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {course.group_size_max} kishigacha
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="font-display font-semibold text-ink-900">
                    {formatPrice(course.price_amount)}
                    <span className="text-xs text-slate-400 font-sans"> /oy</span>
                  </span>
                  <Button to={`/kurslar/${course.slug}`} variant="ghost" size="sm" className="!px-3">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
