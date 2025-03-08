'use client';

import OutstandingEvent from '@/components/ui/OutstandingEvent';
import PopularCategory from '@/components/ui/PopularCategory';
import HeroSection from '@/components/ui/HeroSection';
import CTASection from '@/components/ui/CTASection';
import FeaturedSpeakers from '@/components/ui/FeaturedSpeakers';
import EventTimeline from '@/components/ui/EventTimeline';
import Testimonials from '@/components/ui/Testimonials';
import Partners from '@/components/ui/Partners';
import FAQ from '@/components/ui/FAQ';
import Newsletter from '@/components/ui/Newsletter';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section với Parallax Effect */}
      <HeroSection />

      {/* Categories Grid với Hover Effect 3D */}
      <PopularCategory />

      {/* Event Carousel Section */}
      <OutstandingEvent />

      {/* <FeaturedSpeakers /> */}
      <EventTimeline />
      <Testimonials />
      {/* <Partners /> */}
      <FAQ />
      <Newsletter />

      {/* CTA Section với Gradient Animation */}
      <CTASection />
    </div>
  );
};

export default HomePage;
