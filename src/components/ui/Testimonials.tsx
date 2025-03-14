'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: 'Trải nghiệm tuyệt vời với nhiều kiến thức hữu ích!',
      author: 'Trần Thị B',
      role: 'Người tham dự',
    },
    {
      id: 2,
      text: 'Sự kiện rất chất lượng, tôi đã học được rất nhiều điều mới!',
      author: 'Nguyễn Văn A',
      role: 'Người tham dự',
    },
    {
      id: 3,
      text: 'Rất ấn tượng với chất lượng của sự kiện!',
      author: 'Phạm Văn C',
      role: 'Người tham dự',
    },
    {
      id: 4,
      text: 'Tôi rất hài lòng với sự kiện!',
      author: 'Nguyen Van D',
      role: 'Người tham dự',
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.8,
      },
    },
  };

  const starVariants = {
    initial: { scale: 0 },
    animate: (index: number) => ({
      scale: 1,
      transition: {
        type: 'spring',
        delay: index * 0.1,
        stiffness: 150,
        damping: 10,
      },
    }),
    hover: { scale: 1.2 },
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-4xl font-bold text-white md:text-5xl"
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Phản Hồi Từ Người Tham Gia
          </span>
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
        >
          {testimonials.map(testimonial => (
            <motion.div
              key={testimonial.id}
              variants={item}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-lg"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(200px_at_0%_0%,rgba(99,102,241,0.15),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-6 flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 font-bold text-white shadow-lg"
                >
                  <span className="text-xl">{testimonial.author[0]}</span>
                </motion.div>
                <div className="ml-5">
                  <motion.p
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className="text-lg font-semibold text-white"
                  >
                    {testimonial.author}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-gray-400"
                  >
                    {testimonial.role}
                  </motion.p>
                </div>
              </div>

              <motion.p
                className="text-lg italic text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                "{testimonial.text}"
              </motion.p>

              <motion.div
                className="mt-6 flex gap-1"
                initial="initial"
                animate="animate"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={starVariants}
                    custom={i}
                    whileHover="hover"
                  >
                    <StarIcon className="h-6 w-6 fill-yellow-400/80 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>

              <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-purple-400/20 blur-2xl transition-all duration-500 group-hover:scale-150" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
