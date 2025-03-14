'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      question: 'Làm cách nào để đăng ký tham dự?',
      answer: 'Bạn có thể đăng ký trực tiếp trên website...',
    },
    {
      question: 'Tôi có cần phải trả phí để tham dự sự kiện không?',
      answer: 'Không, sự kiện của chúng tôi là miễn phí...',
    },
    {
      question: 'Làm cách nào để đăng ký tham dự?',
      answer: 'Bạn có thể đăng ký trực tiếp trên website...',
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.5,
      },
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.2,
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
      <div className="mx-auto max-w-4xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-4xl font-bold text-white md:text-5xl"
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Câu hỏi Thường gặp
          </span>
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={item}
              className="overflow-hidden rounded-xl border border-white/10 bg-gray-800/20 backdrop-blur-lg"
            >
              <div
                className="flex cursor-pointer items-center justify-between p-6 transition-all hover:bg-gray-800/30"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-white md:text-xl">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{
                    rotate: openIndex === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="h-6 w-6 text-gray-400" />
                </motion.div>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={contentVariants}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
