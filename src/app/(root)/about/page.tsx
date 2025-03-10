'use client';

import { motion } from 'framer-motion';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import CounterCard from '@/components/ui/CounterCard';

export default function MusicEventIntroduction() {
  const stats = [
    {
      targetValue: 50,
      label: 'Sự kiện đã tổ chức',
      color: 'from-purple-400 to-pink-300',
    },
    {
      targetValue: 300,
      label: 'Nghệ sĩ hợp tác',
      color: 'from-pink-400 to-orange-300',
    },
    {
      targetValue: 99,
      label: 'Khán giả hài lòng',
      color: 'from-orange-400 to-yellow-300',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-purple-950 via-pink-950 to-purple-900 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="rounded-[3rem] border-4 border-purple-200/10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-12 shadow-2xl shadow-purple-900/50 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-16 flex justify-center">
            <motion.div
              className="shadow-glow flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <UserGroupIcon className="h-16 w-16 text-white/90" />
            </motion.div>
          </div>

          <motion.h2
            className="mb-16 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-center text-5xl font-black text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Hành Trình Âm Nhạc
          </motion.h2>

          <div className="mb-20 grid gap-12 md:grid-cols-3">
            {stats.map((item, index) => (
              <CounterCard
                key={index}
                targetValue={item.targetValue}
                label={item.label}
                color={item.color}
                delay={0.7 + index * 0.1}
              />
            ))}
          </div>

          <motion.p
            className="mx-auto max-w-4xl text-center text-2xl leading-relaxed text-purple-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-3xl font-bold text-pink-300">
              10+ năm kinh nghiệm
            </span>{' '}
            mang đến những đêm nhạc đỉnh cao với hệ thống{' '}
            <span className="text-purple-300">âm thanh 5D</span> và{' '}
            <span className="text-pink-300">ánh sáng laser</span> đa sắc màu.
            Cam kết trải nghiệm{' '}
            <span className="underline decoration-yellow-400">
              an toàn tuyệt đối
            </span>{' '}
            và{' '}
            <span className="underline decoration-pink-400">
              chất lượng vượt trội
            </span>
            .
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
