import React from 'react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="animate-gradient-x absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="mb-6 text-4xl font-bold text-white">
          Sẵn sàng tạo sự kiện của riêng bạn?
        </h2>
        <p className="mb-8 text-xl text-purple-100">
          Kết nối với hàng ngàn người tham gia tiềm năng chỉ trong vài bước đơn
          giản
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-purple-600 shadow-2xl transition-all hover:bg-opacity-90"
        >
          Bắt đầu ngay →
        </motion.button>
      </div>
    </section>
  );
};

export default CTASection;
