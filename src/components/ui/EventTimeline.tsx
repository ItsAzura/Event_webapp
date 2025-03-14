'use client';

import { useState } from 'react';
import { eventTimeLine } from '@/data/index';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { FiCalendar, FiMapPin, FiChevronRight } from 'react-icons/fi';

const EventTimeline = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: {
      y: -8,
      boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.15)',
    },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3,
      },
    },
  };

  const dotVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: (index: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: index * 0.2,
      },
    }),
    hover: {
      scale: 1.1,
      background: 'conic-gradient(from 180deg, #6366f1, #8b5cf6)',
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-4xl font-bold text-white md:text-5xl"
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Event Journey
          </span>
        </motion.h2>

        <div className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="absolute left-1/2 hidden h-full w-0.5 origin-top -translate-x-1/2 bg-gradient-to-b from-blue-400/30 to-purple-400/30 md:block"
          />

          {eventTimeLine.map((event, index) => (
            <div
              key={index}
              className="relative mb-12 md:flex md:items-center md:justify-between md:odd:flex-row-reverse"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Event Card */}
              <div className="md:w-[45%]">
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                    mass: 0.5,
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-lg"
                >
                  <div className="absolute inset-0 -z-10 bg-[radial-gradient(200px_at_0%_0%,rgba(99,102,241,0.15),transparent)]" />

                  <motion.div
                    className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-400/20 blur-3xl"
                    animate={{
                      x: hoveredIndex === index ? 0 : 100,
                      opacity: hoveredIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">
                        {event.title}
                      </h3>

                      <div className="mt-4 flex flex-col gap-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="h-5 w-5 text-blue-400" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="h-5 w-5 text-purple-400" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <FiChevronRight className="h-6 w-6 text-white/40 transition-all group-hover:text-blue-400" />
                  </div>

                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        className="mt-6 border-t border-white/10 pt-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p className="text-gray-400">{event.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Timeline Dot */}
              <div className="hidden md:block md:w-[10%]">
                <motion.div
                  variants={dotVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  custom={index}
                  className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-xl shadow-blue-400/20"
                >
                  <span className="text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="absolute inset-0 -z-10 rounded-full bg-blue-400/30 blur-md" />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTimeline;
