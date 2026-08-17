import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../shared/Button';

export default function CtaSection() {
  return (
    <section className="section-padding bg-ink-50">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-ink-900 to-ink-800 rounded-3xl px-8 md:px-16 py-16 text-center overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />

          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4 text-balance relative z-10">
            Bugun birinchi qadamni tashlang
          </h2>
          <p className="text-slate-300 max-w-md mx-auto mb-8 relative z-10">
            Bepul darajani aniqlash testidan o'ting va sizga mos kursni toping — 15 daqiqada.
          </p>
          <div className="relative z-10">
            <Button to="/test" size="lg">
              Testni boshlash
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
