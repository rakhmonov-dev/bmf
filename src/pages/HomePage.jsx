import Hero from '../components/home/Hero';
import HowItWorksSection from '../components/home/HowItWorksSection';
import PricingSection from '../components/home/PricingSection';
import CoursesPreview from '../components/home/CoursesPreview';
import WhyUs from '../components/home/WhyUs';
import GallerySection from '../components/shared/GallerySection';
import Testimonials from '../components/home/Testimonials';
import CtaSection from '../components/home/CtaSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <GallerySection />
      <HowItWorksSection />
      <PricingSection />
      <WhyUs />
      <Testimonials />
      <CtaSection />
    </>
  );
}
