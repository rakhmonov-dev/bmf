import Hero from '../components/home/Hero';
import CoursesPreview from '../components/home/CoursesPreview';
import WhyUs from '../components/home/WhyUs';
import Testimonials from '../components/home/Testimonials';
import CtaSection from '../components/home/CtaSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CoursesPreview />
      <WhyUs />
      <Testimonials />
      <CtaSection />
    </>
  );
}
