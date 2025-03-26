import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import { randomEventNumber } from '@/utils/randomEventNumber';
import { randomIcon } from '@/utils/randomIcon';
import Loading from '../Shared/Loading';

const PopularCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        'https://localhost:7198/api/v1/Category/top',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -15,
      scale: 1.03,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
  };

  if (loading) return <Loading label="Đang tải danh mục" color="purple" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-16 flex flex-col items-end justify-between md:flex-row"
        >
          <div className="mb-8 md:mb-0">
            <motion.h2
              initial={{ x: -30 }}
              animate={{ x: 0 }}
              className="text-5xl font-bold text-white"
            >
              Thể loại{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Phổ biến
              </span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-xl text-lg text-gray-300"
          >
            Khám phá đa dạng các loại hình sự kiện từ những lĩnh vực hot nhất
            hiện nay
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence>
            {categories.map(category => (
              <motion.div
                key={category.categoryID}
                variants={item}
                whileHover="hover"
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gray-800/20 p-8 backdrop-blur-lg"
              >
                <motion.div variants={hoverVariants} className="relative">
                  <div className="mb-6">
                    <div className="relative inline-block rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3 backdrop-blur-lg">
                      {React.createElement(randomIcon(), {
                        className: 'h-8 w-8 text-purple-400',
                      })}
                      <div className="absolute inset-0 -z-10 rounded-2xl bg-purple-500/10 blur-md" />
                    </div>
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-white">
                    {category.categoryName}
                  </h3>

                  <motion.p
                    initial={{ opacity: 0.8 }}
                    className="text-lg font-medium text-gray-400"
                  >
                    {randomEventNumber()}K sự kiện
                  </motion.p>

                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="absolute -right-2 bottom-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-2 shadow-lg"
                  >
                    <ArrowRightIcon className="h-5 w-5 text-white" />
                  </motion.div>
                </motion.div>

                <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/20 blur-2xl transition-all group-hover:scale-150" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularCategory;
