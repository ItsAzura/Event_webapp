'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import {
  UserGroupIcon,
  MusicalNoteIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import CounterCard from '@/components/ui/CounterCard';
import { useEffect } from 'react';

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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = e.currentTarget as HTMLElement;
      if (rect) {
        const x = clientX - rect.offsetLeft;
        const y = clientY - rect.offsetTop;
        mouseX.set(x / rect.offsetWidth);
        mouseY.set(y / rect.offsetHeight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-pink-950 to-purple-900 px-4 py-24 sm:px-6 lg:px-8">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-purple-500"
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            transition={{
              duration: 2 + Math.random() * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          className="group relative rounded-[3rem] border-4 border-purple-200/10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-12 shadow-2xl shadow-purple-900/50 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1000,
          }}
        >
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-[3rem]">
            <motion.div
              className="animate-spin-slow absolute h-[200%] w-[200%] bg-[conic-gradient(var(--tw-gradient-stops))] from-purple-400 via-transparent to-transparent opacity-20"
              style={{
                left: '-50%',
                top: '-50%',
                maskImage: 'radial-gradient(black, transparent 70%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="mb-16 flex justify-center">
              <motion.div
                className="shadow-glow flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                <UserGroupIcon className="h-16 w-16 text-white/90" />
                <motion.div
                  className="absolute -inset-4 rounded-full border-2 border-purple-400/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </div>

            <motion.h2
              className="mb-16 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-center text-5xl font-black text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="inline-block">
                {['H', 'à', 'n', 'h', ' ', 'T', 'r', 'ì', 'n', 'h'].map(
                  (char, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      {char}
                    </motion.span>
                  ),
                )}
              </span>
              <br />
              <span className="mt-4 inline-block">
                {['Â', 'm', ' ', 'N', 'h', 'ạ', 'c'].map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h2>

            <div className="mb-20 grid gap-12 md:grid-cols-3">
              {stats.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <CounterCard
                    targetValue={item.targetValue}
                    label={item.label}
                    color={item.color}
                    delay={0.7 + index * 0.1}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mx-auto max-w-4xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-2xl leading-relaxed text-purple-100/90">
                <motion.span
                  className="relative inline-block text-3xl font-bold text-pink-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <SparklesIcon className="absolute -left-8 top-1/2 h-6 w-6 -translate-y-1/2 text-yellow-400" />
                  10+ năm kinh nghiệm
                </motion.span>{' '}
                mang đến những đêm nhạc đỉnh cao với hệ thống{' '}
                <motion.span
                  className="text-purple-300 underline decoration-blue-400"
                  whileHover={{ color: '#9333ea' }}
                >
                  âm thanh 5D
                </motion.span>{' '}
                và{' '}
                <motion.span
                  className="text-pink-300 underline decoration-pink-400"
                  whileHover={{ color: '#ec4899' }}
                >
                  ánh sáng laser
                </motion.span>{' '}
                đa sắc màu. Cam kết trải nghiệm{' '}
                <motion.span
                  className="underline decoration-yellow-400"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(250,204,21,0.3)',
                      '0 0 20px rgba(250,204,21,0.5)',
                      '0 0 10px rgba(250,204,21,0.3)',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  an toàn tuyệt đối
                </motion.span>{' '}
                và{' '}
                <motion.span
                  className="underline decoration-pink-400"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(236,72,153,0.3)',
                      '0 0 20px rgba(236,72,153,0.5)',
                      '0 0 10px rgba(236,72,153,0.3)',
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  chất lượng vượt trội
                </motion.span>
                .
              </p>
            </motion.div>
          </div>

          {/* Floating Music Notes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-purple-400"
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: Math.random() * 360,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                <MusicalNoteIcon className="h-8 w-8" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
