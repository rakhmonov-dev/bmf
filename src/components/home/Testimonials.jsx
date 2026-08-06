import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getTestimonials } from '../../services/contentService';
import { SectionHeading } from '../shared/Common';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding bg-ink-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="container-wide relative z-10">
        <SectionHeading
          eyebrow="O'quvchilarimiz fikri"
          title="Natijalar so'zlaydi"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 backdrop-blur-sm"
            >
              <Quote className="w-6 h-6 text-gold-400 mb-4 opacity-60" />
              <p className="text-slate-200 text-sm leading-relaxed mb-6">"{t.quote_text}"</p>

              <div className="flex items-center gap-3">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.full_name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-semibold text-sm">
                    {t.full_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">{t.full_name}</p>
                  {t.achieved_level && (
                    <p className="text-xs text-gold-400">{t.achieved_level} darajaga erishdi</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
