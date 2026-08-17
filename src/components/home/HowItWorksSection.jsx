import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { getGalleryImages } from '../../services/contentService';
import { SectionHeading } from '../shared/Common';

const STEPS = [
  { title: 'BMG Schoolga kelasiz', category: 'Jarayon-1' },
  { title: 'Natijani ko\'rasiz', category: 'Jarayon-2' },
  { title: 'Sertifikatingizni olasiz', category: 'Jarayon-3' },
];

/**
 * 3 bosqichli jarayon rasmlari admin panel → Galereya orqali "Jarayon-1",
 * "Jarayon-2", "Jarayon-3" kategoriyalari bilan yuklanadi. Har bir
 * kategoriyada bir nechta rasm bo'lsa, birinchisi ko'rsatiladi — bu
 * bo'lim tez-tez almashadigan slaydshou emas, balki doimiy va aniq
 * 3 bosqichli hikoya bo'lishi kerak.
 */
export default function HowItWorksSection() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getGalleryImages().then(setImages).catch(() => {});
  }, []);

  function getImageForStep(category) {
    return images.find((img) => img.category === category);
  }

  const hasAnyStepImage = STEPS.some((step) => getImageForStep(step.category));
  if (!hasAnyStepImage) return null;

  return (
    <section className="section-padding bg-ink-50">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Jarayon"
          title="Uch qadam — aniq natija"
          subtitle="Har bir o'quvchimiz shu yo'ldan o'tadi"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => {
            const image = getImageForStep(step.category);
            if (!image) return null;

            return (
              <motion.div
                key={step.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-5">
                  {image.media_type === 'video' ? (
                    <video
                      src={image.image_url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={image.image_url}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gold-400 text-ink-900 font-display font-semibold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-ink-900">
                  {step.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mt-12 text-center"
        >
          <ShieldCheck className="w-5 h-5 text-gold-500 flex-shrink-0" />
          <p className="font-display font-semibold text-lg md:text-xl text-ink-900">
            Agar bunday bo'lmasa — pulingizni to'liq qaytarib beramiz
          </p>
        </motion.div>
      </div>
    </section>
  );
}
