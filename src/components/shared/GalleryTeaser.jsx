import { Link } from 'react-router-dom';
import { Images, ArrowRight } from 'lucide-react';

/**
 * Bosh sahifa va Biz haqimizda uchun yengil galereya bannerlari — to'liq
 * GallerySection (tab'lar, slaydshou, lightbox) faqat /galereya sahifasida
 * ko'rsatiladi, shu yerda esa faqat o'sha sahifaga taklif qilinadi. Bu
 * bir xil og'ir komponentni uch joyda takrorlamaslik uchun qilingan.
 */
export default function GalleryTeaser() {
  return (
    <div className="container-wide px-6 md:px-10 lg:px-16 mt-24">
      <Link
        to="/galereya"
        className="group relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-ink-900 px-8 py-10 sm:px-12 sm:py-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="relative flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-14 h-14 rounded-2xl bg-gold-400 flex items-center justify-center flex-shrink-0">
            <Images className="w-7 h-7 text-ink-900" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-slate-300 text-sm">
              Darslarimiz, tadbirlarimiz va o'quvchilarimizning muvaffaqiyatlaridan lavhalar
            </p>
          </div>
        </div>
        <span className="relative flex items-center gap-2 bg-gold-400 text-ink-900 text-sm font-semibold px-6 py-3.5 rounded-xl group-hover:bg-gold-300 transition-colors flex-shrink-0">
          To'liq ko'rish
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  );
}
