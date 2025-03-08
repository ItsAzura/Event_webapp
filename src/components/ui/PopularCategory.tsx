import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import { randomEventNumber } from '@/utils/randomEventNumber';
import { randomIcon } from '@/utils/randomIcon';

const PopularCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7198/api/Category/top');
      const data = await response.json();
      setCategories(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-14 flex flex-col items-end justify-between md:flex-row">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Thể loại <span className="text-purple-600">Phổ biến</span>
        </h2>
        <p className="max-w-xl text-gray-600">
          Khám phá đa dạng các loại hình sự kiện từ những lĩnh vực hot nhất hiện
          nay
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.categoryID}
            whileHover={{ y: -10 }}
            className="group relative rounded-2xl bg-white p-6 shadow-xl transition-all hover:shadow-2xl"
          >
            <div
              className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100`}
            >
              {React.createElement(randomIcon(), {
                className: 'h-8 w-8 text-purple-600',
              })}
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              {category.categoryName}
            </h3>
            <p className="text-gray-500"> {randomEventNumber()}K sự kiện</p>
            <div className="absolute bottom-6 right-6 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRightIcon className="h-6 w-6 text-purple-600" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategory;
