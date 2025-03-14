'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email không được để trống');
      return;
    }
    toast.success('Đăng ký thành công!');
    setEmail('');
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        duration: 0.8,
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={container}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 px-8 py-12 backdrop-blur-lg"
        >
          {/* Background effects */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(400px_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />
          <div
            className={`absolute inset-0 -z-10 bg-[radial-gradient(400px_at_50%_100%,rgba(99,102,241,0.15),transparent)] transition-opacity duration-300 ${
              isFocused ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <motion.h3
            variants={item}
            className="mb-4 text-3xl font-bold text-white md:text-4xl"
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Nhận thông báo mới nhất
            </span>
          </motion.h3>

          <motion.p variants={item} className="mb-8 text-lg text-gray-300">
            Đăng ký để không bỏ lỡ bất kỳ sự kiện thú vị nào
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            variants={container}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <motion.div variants={item} className="relative w-full sm:w-96">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-6 py-4 text-white backdrop-blur-lg transition-all placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </motion.div>

            <motion.button
              variants={item}
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30"
            >
              Đăng ký ngay
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
