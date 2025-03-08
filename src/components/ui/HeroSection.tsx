import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Event background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-purple-900/40" />
      </div>

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
            Khám phá <span className="text-purple-400">Sự kiện</span>
            <br />
            Thế giới của bạn
          </h1>

          {/* Search Bar với Glassmorphism */}
          <motion.div
            className="max-w-3xl rounded-xl bg-white/20 p-1 shadow-2xl backdrop-blur-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 p-4">
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện, địa điểm hoặc thể loại..."
                className="w-full border-none bg-transparent text-lg text-white placeholder-gray-200 focus:ring-0"
              />
              <button className="rounded-lg bg-purple-600 p-3 transition-all hover:bg-purple-700">
                <ArrowRightIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
