'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { Category, ApiResponse } from '@/types/index';
import Image from 'next/image';

interface EventsClientProps {
  name: string;
  eventAreaUrl: string;
  eventsData: ApiResponse;
  categories: Category[];
  searchParams: { [key: string]: string | undefined };
}

export default function EventsClient({
  name,
  eventAreaUrl,
  eventsData,
  categories,
  searchParams,
}: EventsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.categoryId || '',
  );

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('categoryId', selectedCategory);
    params.set('page', '1'); // Reset về trang đầu tiên khi filter
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header với hiệu ứng parallax */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative mb-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
          <h1 className="relative mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
            <span className="mb-2 block">{name}</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-medium text-transparent md:text-5xl">
              Nơi Khoảnh khắc Được Tạo Ra
            </span>
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-6 inline-block"
          >
            <div className="group relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200" />
              <Link href={`/events/createevent`}>
                <button className="relative rounded-lg bg-white px-8 py-3 text-lg font-semibold text-gray-900 shadow-lg transition-all dark:bg-gray-800 dark:text-gray-100">
                  🎉 Bắt đầu khám phá
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Section với hiệu ứng thủy tinh */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/80"
        >
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                onChange={e => setSearchTerm(e.target.value)}
                className="peer w-full rounded-2xl border-2 border-gray-200/50 bg-transparent p-5 text-lg transition-all focus:border-blue-500 focus:ring-0 dark:border-gray-700/50"
                value={searchTerm}
                placeholder="Tìm Kiếm Sự kiện..."
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-2xl border-2 border-gray-200/50 bg-transparent p-5 text-lg transition-all focus:border-blue-500 focus:ring-0 dark:border-gray-700/50"
                defaultValue={searchParams.categoryId || ''}
              >
                <option value="" className="text-gray-900">
                  Tất cả danh mục
                </option>
                {categories.map(category => (
                  <option
                    key={category.categoryID}
                    value={category.categoryID}
                    className="text-gray-900"
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-5 top-6 text-gray-400 dark:text-gray-500">
                ▼
              </div>
            </div>

            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5 text-lg font-semibold text-white shadow-xl transition-all hover:shadow-2xl"
            >
              <span className="relative">🔍 Tìm Kiếm</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Event Grid với hiệu ứng 3D */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
          className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {eventsData ? (
            eventsData.events.map(event => (
              <motion.div
                key={event.eventID}
                variants={{
                  hidden: { opacity: 0, y: 30, rotateY: 45 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    transition: { type: 'spring', stiffness: 100 },
                  },
                }}
                whileHover={{
                  y: -10,
                  rotateZ: -1,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                className="transform-style-preserve-3d perspective-1000 group relative overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-800"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                  <Image
                    unoptimized
                    src={`https://localhost:7198/api/event/images/${event.eventImage}`}
                    alt={event.eventName}
                    fill
                    className="transform object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:opacity-0" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
                    <h3 className="text-2xl font-bold text-white">
                      {event.eventName}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                  >
                    ⚡ {event.eventStatus}
                  </motion.div>

                  <p className="mb-6 line-clamp-3 text-gray-600 dark:text-gray-300">
                    {event.eventDescription}
                  </p>

                  <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium">{event.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                      <span className="font-medium">{event.eventLocation}</span>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="mt-6 flex items-center gap-2"
                  >
                    <Link
                      href={`/${eventAreaUrl}/${event.eventID}`}
                      className="flex items-center text-lg font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Discover More
                      <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </motion.div>
                </div>

                {/* Ribbon cho event mới */}
                {event.eventDate &&
                  new Date(event.eventDate) >
                    new Date(Date.now() - 7 * 86400000) && (
                    <div className="absolute right-[-30px] top-4 w-[120px] rotate-45 bg-green-500 py-1 text-center text-xs font-bold text-white">
                      JUST ADDED
                    </div>
                  )}
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Không có sự kiện nào phù hợp
            </div>
          )}
        </motion.div>

        {eventsData.events.length === 0 && (
          <motion.div className="py-10 text-center text-gray-500 dark:text-gray-400">
            Không có sự kiện nào phù hợp
          </motion.div>
        )}

        {/* Pagination với hiệu ứng động */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative h-2 w-full max-w-md overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(eventsData.currentPage / eventsData.totalPages) * 100}%`,
              }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center"
            >
              <Link
                href={`?page=${eventsData.currentPage - 1}`}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                  eventsData.currentPage === 1
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
                    : 'bg-white text-gray-700 shadow-lg hover:shadow-xl dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                <ArrowLeftIcon className="h-6 w-6" />
                <span className="hidden sm:inline">Previous</span>
              </Link>
            </motion.div>

            <div className="flex items-center gap-2">
              {Array.from({ length: eventsData.totalPages }, (_, i) => (
                <motion.div
                  key={i + 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href={`?page=${i + 1}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-medium transition-all ${
                      eventsData.currentPage === i + 1
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center"
            >
              <Link
                href={`?page=${eventsData.currentPage + 1}`}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                  eventsData.currentPage === eventsData.totalPages
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
                    : 'bg-white text-gray-700 shadow-lg hover:shadow-xl dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRightIcon className="h-6 w-6" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
