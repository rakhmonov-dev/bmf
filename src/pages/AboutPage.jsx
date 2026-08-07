import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { getTeachers, getPublicSettings } from '../services/contentService';
import { LoadingSpinner } from '../components/shared/Common';
import GallerySection from '../components/shared/GallerySection';

export default function AboutPage() {
  const [teachers, setTeachers] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeachers(), getPublicSettings()])
      .then(([teachersData, settingsData]) => {
        setTeachers(teachersData);
        setSettings(settingsData);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-20">
      <div className="container-narrow px-6 text-center mb-20">
        <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest mb-3 block">
          Biz haqimizda
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-ink-900 mb-6 text-balance">
          {settings.about_title || 'BMG School haqida'}
        </h1>
        <p className="text-slate-600 leading-relaxed text-lg text-balance">
          {settings.about_body ||
            'BMG School — Samarqand shahridagi ingliz tili o\'quv markazi.'}
        </p>
      </div>

      {settings.about_mission && (
        <div className="bg-ink-900 py-16 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
          <div className="container-narrow px-6 text-center relative z-10">
            <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-4">
              Missiyamiz
            </p>
            <p className="text-white text-xl md:text-2xl font-display leading-relaxed text-balance">
              {settings.about_mission}
            </p>
          </div>
        </div>
      )}

      <div className="container-wide px-6 md:px-10 lg:px-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-display font-semibold text-ink-900 mb-3">O'qituvchilarimiz</h2>
          <p className="text-slate-500">Tajribali va malakali mutaxassislar jamoasi</p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, idx) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-gold-300 transition-colors"
              >
                {teacher.photo_url ? (
                  <img
                    src={teacher.photo_url}
                    alt={teacher.full_name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-ink-900 flex items-center justify-center text-gold-400 font-display font-semibold text-xl mx-auto mb-4">
                    {teacher.full_name.charAt(0)}
                  </div>
                )}
                <h3 className="font-semibold text-ink-900 mb-1">{teacher.full_name}</h3>
                {teacher.specialty && (
                  <p className="text-xs text-gold-600 mb-2">{teacher.specialty}</p>
                )}
                {teacher.experience_years && (
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    {teacher.experience_years} yillik tajriba
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <GallerySection />
    </div>
  );
}
