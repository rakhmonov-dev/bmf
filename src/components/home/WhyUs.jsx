import { motion } from 'framer-motion';
import { Target, Users2, BadgeCheck } from 'lucide-react';
import CefrFoundation from '../shared/CefrFoundation';
import { SectionHeading } from '../shared/Common';

const REASONS = [
  {
    icon: Target,
    title: 'Aniq daraja tizimi',
    description: "CEFR standarti asosida — har bir bosqichda qayerda turganingizni va nimaga erishishingizni aniq bilasiz.",
  },
  {
    icon: Users2,
    title: 'Kichik guruhlar',
    description: "8-12 kishilik guruhlar — har bir o'quvchiga individual e'tibor berish imkonini beradi.",
  },
  {
    icon: BadgeCheck,
    title: "Tajribali o'qituvchilar",
    description: "Xalqaro sertifikatlarga ega, o'z sohasida yillar davomida tajriba orttirgan mutaxassislar.",
  },
];

export default function WhyUs() {
  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Nima uchun BMG School"
              title="Har bir qadam poydevor ustiga quriladi"
              subtitle="Til o'rganish tasodifiy jarayon emas — bu bosqichma-bosqich, mustahkam asosda quriladigan tizim."
            />

            <div className="flex flex-col gap-6">
              {REASONS.map((reason, idx) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-ink-900 flex items-center justify-center flex-shrink-0">
                    <reason.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink-900 mb-1">{reason.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-10 shadow-xl shadow-ink-900/5 border border-slate-100"
          >
            <CefrFoundation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
