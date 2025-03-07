'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';
import { categories, events } from '@/data';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section với Parallax Effect */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Event background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-purple-900/40" />
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="mb-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
              Khám phá <span className="text-purple-400">Sự kiện</span>
              <br />
              Thế giới của bạn
            </h1>

            {/* Search Bar với Glassmorphism */}
            <motion.div
              className="max-w-3xl rounded-xl bg-white/20 p-1 shadow-2xl backdrop-blur-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 p-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện, địa điểm hoặc thể loại..."
                  className="w-full border-none bg-transparent text-lg text-white placeholder-gray-200 focus:ring-0"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button className="rounded-lg bg-purple-600 p-3 transition-all hover:bg-purple-700">
                  <ArrowRightIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid với Hover Effect 3D */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-14 flex flex-col items-end justify-between md:flex-row">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Thể loại <span className="text-purple-600">Phổ biến</span>
          </h2>
          <p className="max-w-xl text-gray-600">
            Khám phá đa dạng các loại hình sự kiện từ những lĩnh vực hot nhất
            hiện nay
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              whileHover={{ y: -10 }}
              className="group relative rounded-2xl bg-white p-6 shadow-xl transition-all hover:shadow-2xl"
            >
              <div
                className={`${category.color} mb-6 flex h-14 w-14 items-center justify-center rounded-2xl`}
              >
                <category.icon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">
                {category.name}
              </h3>
              <p className="text-gray-500">{category.count} sự kiện</p>
              <div className="absolute bottom-6 right-6 opacity-0 transition-opacity group-hover:opacity-100">
                <ArrowRightIcon className="h-6 w-6 text-purple-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Event Carousel Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-4xl font-bold text-gray-900">
              Sự kiện <span className="text-purple-600">Nổi bật</span>
            </h2>
            <Link href="/events">
              <button className="flex items-center gap-2 font-semibold text-purple-600 hover:text-purple-700">
                Xem tất cả
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <motion.div
                key={event.id}
                whileHover="hover"
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg"
              >
                <div className="relative h-72">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="transform object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-sm text-white">
                    {event.type}
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-gray-500">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section với Gradient Animation */}
      <section className="relative overflow-hidden py-28">
        <div className="animate-gradient-x absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />

        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Sẵn sàng tạo sự kiện của riêng bạn?
          </h2>
          <p className="mb-8 text-xl text-purple-100">
            Kết nối với hàng ngàn người tham gia tiềm năng chỉ trong vài bước
            đơn giản
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
    </div>
  );
};

export default HomePage;
