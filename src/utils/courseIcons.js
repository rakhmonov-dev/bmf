/**
 * Kurs ikonkalari uchun markazlashtirilgan xarita. `import * as Icons from
 * 'lucide-react'` o'rniga faqat ishlatiladigan ikonalarni named import qilib,
 * bundle hajmini sezilarli kamaytiradi (barcha 1000+ lucide ikonasi o'rniga
 * faqat shu 8 tasi bundle'ga qo'shiladi).
 *
 * Admin paneldagi CourseForm'dagi ICON_OPTIONS ro'yxati bilan bir xil bo'lishi
 * kerak — agar u yerga yangi ikonka qo'shilsa, bu yerga ham qo'shing.
 */
import {
  BookOpen, MessageCircle, TrendingUp, Award, Briefcase, Smile, Globe, Mic,
} from 'lucide-react';

export const COURSE_ICON_MAP = {
  BookOpen,
  MessageCircle,
  TrendingUp,
  Award,
  Briefcase,
  Smile,
  Globe,
  Mic,
};

export function getCourseIcon(name) {
  return COURSE_ICON_MAP[name] || BookOpen;
}
