import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCourseIcon } from '../../utils/courseIcons';
import { ArrowRight, Users, Clock } from 'lucide-react';
import { getCourses } from '../../services/contentService';
import { SectionHeading, LoadingSpinner } from '../shared/Common';
import { formatPrice } from '../../utils/formatters';
import Button from '../shared/Button';

function CourseIcon({ name, className }) {
  const IconComponent = getCourseIcon(name);
  return <IconComponent className={className} />;
}

export default function CoursesPreview() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="section-padding bg-emerald-50">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Kurslarimiz"
          title="Har bir darajaga mos yo'nalish"
          subtitle="Boshlang'ichdan professional darajagacha — sizga mos kursni tanlang"
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-slate-50 rounded-2xl p-7 border border-slate-100 hover:border-gold-300 hover:shadow-xl hover:shadow-ink-900/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-ink-900 flex items-center justify-center mb-5 group-hover:bg-gold-400 transition-colors">
                  <CourseIcon
                    name={course.icon_name}
                    className="w-6 h-6 text-gold-400 group-hover:text-ink-900 transition-colors"
                  />
                </div>

                <span className="inline-block text-xs font-semibold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full mb-3">
                  {course.subject === 'math' ? `${course.grade_range || (course.grade_from && course.grade_to ? `${course.grade_from}–${course.grade_to}` : '')} sinf` : `${course.cefr_level_from} — ${course.cefr_level_to}`}
                </span>

                <h3 className="font-display font-semibold text-xl text-ink-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
                  {course.description}
                </p>

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
                    <span className="text-xs text-slate-400 font-sans">/oy</span>
                  </span>
                  <Button to={`/kurslar/${course.slug}`} variant="ghost" size="sm" className="!px-3">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button to="/kurslar" variant="outline">
            Barcha kurslarni ko'rish
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
