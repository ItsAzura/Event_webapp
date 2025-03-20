import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, CalendarIcon, Link, MapPinIcon } from 'lucide-react';
import React from 'react';
import { useEffect } from 'react';
import { useEventStore } from '@/store/eventStore';
import Image from 'next/image';
import { dateFormat } from '@/utils/dateFormat';
import Loading from '../Shared/Loading';

const OutstandingEvent = () => {
  const { topEvents, fetchTopEvents } = useEventStore();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      await fetchTopEvents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      y: -10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    },
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Loading size="lg" label="Đang tải sự kiện nổi bật..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 flex items-end justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-bold text-white"
          >
            Sự kiện{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Nổi bật
            </span>
          </motion.h2>

          <motion.div whileHover={{ x: 5 }}>
            <Link href="/events">
              <button className="flex items-center gap-2 font-semibold text-purple-400 hover:text-purple-300">
                Xem tất cả
                <ArrowRightIcon className="h-6 w-6 transition-transform group-hover:rotate-45" />
              </button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {topEvents.map(event => (
              <motion.div
                key={event.eventID}
                variants={item}
                whileHover="hover"
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gray-800/20 backdrop-blur-lg"
              >
                <motion.div variants={hoverVariants} className="relative h-80">
                  <Image
                    unoptimized
                    src={`https://localhost:7198/api/event/images/${event.eventImage}`}
                    alt={event.eventName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />

                  <motion.span
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg"
                  >
                    Bán Chạy
                  </motion.span>
                </motion.div>

                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm">
                      <CalendarIcon className="h-5 w-5 text-purple-400" />
                      <span className="text-gray-300">
                        {dateFormat(event.eventDate)}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-white">
                    {event.eventName}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPinIcon className="h-5 w-5 text-blue-400" />
                    <span>{event.eventLocation}</span>
                  </div>

                  <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl transition-all group-hover:scale-150" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default OutstandingEvent;
