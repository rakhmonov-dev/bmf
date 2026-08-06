import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../shared/Button';
import CefrFoundation from '../shared/CefrFoundation';
import { getPublicSettings } from '../../services/contentService';

export default function Hero() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getPublicSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <section className="relative bg-ink-900 overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Fon dekoratsiyasi — yumshoq nur dog'lari */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-ink-500/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="container-wide px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-medium text-slate-200">
                Samarqanddagi ishonchli o'quv markazi
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[3.4rem] font-display font-semibold text-white leading-[1.1] text-balance"
            >
              {settings.hero_title || 'Ingliz tilini Samarqandda professional darajada o\'rganing'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 text-lg mt-6 max-w-lg leading-relaxed text-balance"
            >
              {settings.hero_subtitle ||
                "Boshlang'ichdan C1 darajasigacha — tajribali o'qituvchilar, aniq metodika va real natijalar"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-9"
            >
              <Button to="/test" size="lg">
                {settings.hero_cta_text || 'Darajangizni bilib oling'}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button to="/kurslar" variant="outline" size="lg" className="!border-white/20 !text-white hover:!bg-white/10">
                Kurslarni ko'rish
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10"
            >
              <Stat value={settings.stat_students || '450+'} label="o'quvchi" />
              <Stat value={settings.stat_teachers || '4'} label="o'qituvchi" />
              <Stat value={settings.stat_years || '5'} label="yillik tajriba" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-6 text-center">
                CEFR darajalari
              </p>
              <CefrFoundation compact />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-gold-400">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
