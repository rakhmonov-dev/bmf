import GallerySection from '../components/shared/GallerySection';

/**
 * GallerySection endi o'zining to'liq fon (bg-ink-950) va padding'iga
 * (py-24/32) ega — shuning uchun bu yerda faqat header balandligini
 * hisobga oladigan minimal joy qoldiriladi, qo'shimcha padding/fon
 * qo'shilmaydi (aks holda ikki qavat bo'shliq yoki fon chegarasi
 * paydo bo'lardi).
 */
export default function GalleryPage() {
  return (
    <div className="pt-20">
      <GallerySection />
    </div>
  );
}
