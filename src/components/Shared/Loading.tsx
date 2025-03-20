import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  color?: 'purple' | 'blue' | 'cyan';
}

const particleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i: number) => ({
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    rotate: [0, 180],
    transition: {
      duration: 1.5,
      delay: i * 0.1,
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  }),
};

const Loading = ({
  size = 'md',
  label = 'Loading Experience...',
  color = 'purple',
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const colorClasses = {
    purple: 'from-purple-400 to-blue-500',
    blue: 'from-blue-400 to-cyan-500',
    cyan: 'from-cyan-400 to-purple-500',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
      {/* Main Spinner */}
      <div className="relative">
        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            variants={particleVariants}
            initial="initial"
            animate="animate"
            custom={i}
            className={`absolute h-2 w-2 bg-gradient-to-r ${colorClasses[color]} rounded-full`}
            style={{
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              transform: `rotate(${i * 45}deg) translate(40px)`,
            }}
          />
        ))}

        {/* Center Icon - Đã bỏ background đen */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className={`relative rounded-full bg-gradient-to-r ${colorClasses[color]} p-1 ${sizeClasses[size]}`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full backdrop-blur-xl">
            <SparklesIcon
              className={`${sizeClasses[size]} p-2 text-${color}-400`}
            />
          </div>
        </motion.div>
      </div>

      {/* Loading Text - Điều chỉnh màu chữ */}
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
          y: [-2, 2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="flex items-center gap-2 font-semibold text-current"
      >
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {label}
        </span>
        <div className="flex space-x-1 text-current">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.8,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            >
              .
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
