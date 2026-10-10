
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { getCourses, getGalleryImages } from '../../services/contentService';
import { SectionHeading, LoadingSpinner } from '../shared/Common';
import {
  formatPrice,
  calculateDiscountPercent,
  CEFR_DISPLAY,
} from '../../utils/formatters';
import Button from '../shared/Button';

const BANNER_CATEGORY = 'Kurslar-banner';

export default function PricingSection() {
  const [courses, setCourses] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [coursesResult, galleryResult] =
          await Promise.allSettled([
            getCourses(),
            getGalleryImages(),
          ]);

        if (!active) return;

        if (coursesResult.status === 'fulfilled') {
          setCourses(
            Array.isArray(coursesResult.value)
              ? coursesResult.value
              : []
          );
        }

        if (
          galleryResult.status === 'fulfilled' &&
          Array.isArray(galleryResult.value)
        ) {
          const banner = galleryResult.value.find(
            (img) => img.category === BANNER_CATEGORY
          );

          setBannerImage(banner || null);
        }
      } catch (error) {
        console.error('PricingSection error:', error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  // Chegirmali kurslarni ajratish
  const discountedCourses = courses.filter((course) => {
    return (
      calculateDiscountPercent(
        course.original_price,
        course.price_amount
      ) !== null
    );
  });

  // Barcha chegirmali kurslarning narxlarini olish
  const prices = discountedCourses.map((course) =>
    Number(course.price_amount)
  );

  // Narxlar bir xil bo'lsa, umumiy narxni chiqarish
  const commonPrice =
    prices.length > 0 &&
    prices.every(
      (price) =>
        Number.isFinite(price) &&
        price > 0 &&
        price === prices[0]
    )
      ? prices[0]
      : null;

  // Sarlavhani API narxidan avtomatik yaratish
  const pricingTitle =
    commonPrice !== null
      ? `Barcha kurs — ${formatPrice(commonPrice)}`
      : "Kurslarimiz uchun maxsus takliflar";

  if (isLoading) {
    return (
      <div className="container-wide px-6 md:px-10 lg:px-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (discountedCourses.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-gold-50">
      <div className="container-wide">

        <SectionHeading
          eyebrow="Cheklangan taklif"
          title={pricingTitle}
          subtitle="Darajangizdan qat'iy nazar, hozir yozilsangiz maxsus narxda o'qiysiz"
        />

        {/* Banner rasm yoki video */}
        {bannerImage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-ink-900/15 ring-4 ring-gold-300"
          >
            {bannerImage.media_type === 'video' ? (
              <video
                src={bannerImage.image_url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full aspect-[21/9] object-cover"
              />
            ) : (
              <img
                src={bannerImage.image_url}
                alt={
                  bannerImage.caption ||
                  'BMG School kurslari'
                }
                loading="lazy"
                decoding="async"
                className="w-full aspect-[21/9] object-cover"
              />
            )}

            {bannerImage.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent px-6 py-5">
                <p className="text-white text-base font-medium">
                  {bannerImage.caption}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Kurs kartalari */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {discountedCourses.map((course, idx) => {
            const discountPercent =
              calculateDiscountPercent(
                course.original_price,
                course.price_amount
              );

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-white rounded-2xl border-2 border-gold-300 p-6 flex flex-col"
              >

                {/* Chegirma foizi */}
                <div className="absolute -top-3 right-6 bg-gold-400 text-ink-900 text-xs font-bold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </div>

                {/* CEFR darajasi */}
                <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full mb-3 w-fit">
                  {CEFR_DISPLAY[course.cefr_level_from]}
                  {' — '}
                  {CEFR_DISPLAY[course.cefr_level_to]}
                </span>

                {/* Kurs nomi */}
                <h3 className="font-display font-semibold text-lg text-ink-900 mb-4">
                  {course.title}
                </h3>

                {/* Yangi narx */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-display font-semibold text-ink-900">
                    {formatPrice(course.price_amount)}
                  </span>
                </div>

                {/* Eski narx */}
                <span className="text-sm text-slate-400 line-through mb-5">
                  {formatPrice(course.original_price)}
                </span>

                {/* Kurs haqida */}
                <ul className="flex flex-col gap-2 mb-6 flex-1">

                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    {course.duration_months} oy davomida
                  </li>

                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    Haftada {course.lessons_per_week} marta dars
                  </li>

                </ul>

                {/* Batafsil tugmasi */}
                <Button
                  to={`/kurslar/${course.slug}`}
                  variant="secondary"
                  className="w-full !justify-center"
                >
                  Batafsil
                </Button>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
