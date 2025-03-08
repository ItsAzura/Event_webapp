import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarIcon, Link, MapPinIcon } from 'lucide-react';
import React from 'react';
import { useEffect } from 'react';
import { useEventStore } from '@/store/eventStore';
import Image from 'next/image';

const OutstandingEvent = () => {
  const { topEvents, fetchTopEvents } = useEventStore();

  useEffect(() => {
    fetchTopEvents();
  }, [fetchTopEvents]);

  return (
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
          {topEvents.map(event => (
            <motion.div
              key={event.eventID}
              whileHover="hover"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg"
            >
              <div className="relative h-72">
                <Image
                  unoptimized
                  src={`https://localhost:7198/api/event/images/${event.eventImage}`}
                  alt={event.eventName}
                  fill
                  className="transform object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                <span className="absolute right-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-sm text-white">
                  Bán Chạy
                </span>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-gray-500">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{event.eventDate}</span>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">
                  {event.eventName}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{event.eventLocation}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutstandingEvent;
