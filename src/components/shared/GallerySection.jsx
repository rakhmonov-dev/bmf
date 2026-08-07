import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { getGalleryImages } from '../../services/contentService';
import { LoadingSpinner } from '../shared/Common';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    getGalleryImages()
      .then(setImages)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrevious();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  function showNext() {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }

  function showPrevious() {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  if (isLoading) {
    return (
      <div className="container-wide px-6 md:px-10 lg:px-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <div className="container-wide px-6 md:px-10 lg:px-16 mt-24">
      <div className="text-center mb-14">
        <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest mb-3 block">
          Hayotimizdan lavhalar
        </span>
        <h2 className="text-3xl font-display font-semibold text-ink-900 mb-3 flex items-center justify-center gap-2.5">
          <Images className="w-7 h-7 text-gold-500" />
          Galereya
        </h2>
        <p className="text-slate-500">Darslarimiz va o'quvchilarimizning muvaffaqiyatlaridan lavhalar</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image, idx) => (
          <motion.button
            key={image.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.04 }}
            onClick={() => setLightboxIndex(idx)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100"
          >
            <img
              src={image.image_url}
              alt={image.caption || 'BMG School galereya'}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {image.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-medium">{image.caption}</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-950/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); showPrevious(); }}
                  className="absolute left-4 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  className="absolute right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={images[lightboxIndex].image_url}
                alt={images[lightboxIndex].caption || 'BMG School galereya'}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
              {images[lightboxIndex].caption && (
                <p className="text-white text-sm mt-4 text-center">{images[lightboxIndex].caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
