'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function CounterCard({
  targetValue,
  label,
  color,
  delay,
}: {
  targetValue: number;
  label: string;
  color: string;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const duration = 2; // Số giây để hoàn thành hiệu ứng

  useEffect(() => {
    const step = Math.ceil(targetValue / (duration * 30)); // Giả định 30 FPS (frames per second)
    const interval = setInterval(() => {
      setCount(prev => {
        const nextValue = prev + step;
        return nextValue >= targetValue ? targetValue : nextValue;
      });
    }, 1000 / 30); // Mỗi frame khoảng 33ms

    return () => clearInterval(interval);
  }, [targetValue]);

  return (
    <motion.div
      className="rounded-2xl bg-purple-900/30 p-8 backdrop-blur transition-all hover:bg-purple-900/40"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <div
        className={`bg-gradient-to-r text-6xl font-black ${color} bg-clip-text text-transparent`}
      >
        {count}+
      </div>
      <p className="mt-4 text-xl font-medium text-purple-100">{label}</p>
    </motion.div>
  );
}

export default CounterCard;
