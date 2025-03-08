'use client';

import { useState } from 'react';
import { eventTimeLine } from '@/data/index';
import { motion, AnimatePresence } from 'framer-motion';

const EventTimeline = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Animation variants để tái sử dụng
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.03 },
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const dotVariants = {
    initial: { scale: 0 },
    animate: (index: number) => ({
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 10,
        delay: index * 0.15,
      },
    }),
    hover: { scale: 1.2 },
  };

  return (
    <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          Lộ trình Sự kiện
        </h2>
        <div className="relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="absolute left-1/2 hidden h-full w-1 origin-top -translate-x-1/2 bg-gray-200 md:block"
          />

          {eventTimeLine.map((event, index) => (
            <div
              key={index}
              className="relative mb-8 md:flex md:items-center md:justify-between md:odd:flex-row-reverse"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="md:w-5/12">
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{
                    type: 'spring',
                    stiffness: 250,
                    damping: 15,
                  }}
                  className="rounded-xl bg-white p-6 shadow-md hover:shadow-xl"
                  layout
                >
                  <h3 className="text-xl font-semibold text-blue-600">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{event.date}</p>
                  <p className="mt-2 text-gray-500">{event.location}</p>

                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.p
                        className="mt-3 text-gray-700"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        {event.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="hidden text-center md:block md:w-2/12">
                <motion.div
                  variants={dotVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  custom={index}
                  className="mx-auto h-8 w-8 rounded-full bg-blue-600"
                />
              </div>

              <div className="md:w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTimeline;
