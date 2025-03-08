'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { categories } from '@/data';
import OutstandingEvent from '@/components/ui/OutstandingEvent';
import PopularCategory from '@/components/ui/PopularCategory';
import HeroSection from '@/components/ui/HeroSection';
import CTASection from '@/components/ui/CTASection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section với Parallax Effect */}
      <HeroSection />

      {/* Categories Grid với Hover Effect 3D */}
      <PopularCategory />

      {/* Event Carousel Section */}
      <OutstandingEvent />

      {/* CTA Section với Gradient Animation */}
      <CTASection />
    </div>
  );
};

export default HomePage;
