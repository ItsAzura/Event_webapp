'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  TicketIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid';
import { getEventById } from '@/services/event/api';
import { getEventAreasByEventId } from '@/services/eventarea/api';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Event, EventArea } from '@/types/index';
import Link from 'next/link';

// Function to format date string to readable format
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  className="size-6"
>
  <path
    fillRule="evenodd"
    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    clipRule="evenodd"
  />
</svg>;

const page = () => {
  const params = useParams();
  const { id } = params;
  const [event, setEvent] = useState<Event>({
    eventID: 0,
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventLocation: '',
    eventImage: '',
    createdBy: 0,
    eventStatus: '',
  });
  const [eventAreas, setEventAreas] = useState<EventArea[]>([]);

  const fetchEvent = async () => {
    try {
      const response = await getEventById(Number(id));
      console.log('Event API Response:', response); // Kiểm tra toàn bộ response
      console.log('Event Data:', response.data);

      if (Array.isArray(response.data)) {
        setEvent(response.data[0]); // Nếu API trả về mảng, lấy phần tử đầu tiên
      } else {
        setEvent(response.data); // Nếu API trả về object, dùng trực tiếp
      }
    } catch (error) {
      console.error('Fetch event error:', error);
    }
  };

  const fetchEventAreas = async () => {
    try {
      const response = await getEventAreasByEventId(Number(id));
      console.log('Event Areas API Response:', response);
      console.log('Event Areas Data:', response.data); // Kiểm tra response.data

      if (Array.isArray(response.data)) {
        setEventAreas(response.data); // Nếu API trả về array, set bình thường
      } else if (response.data) {
        setEventAreas([response.data]); // Nếu trả về object, bọc vào array
      } else {
        console.warn('Event Areas API returned unexpected format:', response);
        setEventAreas([]);
      }
    } catch (error) {
      console.error('Fetch event areas error:', error);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchEventAreas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="relative flex h-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl px-4 text-center text-white"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              {event.eventName}
            </h1>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                {formatDate(event.eventDate)}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-5 w-5" />
                {event.eventLocation}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Event Details
              </h2>
              <p className="whitespace-pre-line text-gray-600">
                {event.eventDescription}
              </p>
            </div>

            {/* Image Section */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={`https://localhost:7198/api/event/images/${event.eventImage}`}
                alt={event.eventName}
                className="h-96 w-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Ticket Areas */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-800">Available Areas</h3>
            {eventAreas?.length > 0 ? (
              eventAreas.map((area, index) => (
                <motion.div
                  key={area.eventAreaID}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {area.areaName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Capacity: {area.capacity} seats
                      </p>
                    </div>
                    <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Available
                    </span>
                  </div>
                  <Link
                    href={`/eventarea/${area.eventAreaID}`}
                    className="flex items-center text-lg font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <button className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
                      <TicketIcon className="mr-2 h-5 w-5" />
                      Register Now
                    </button>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No event areas available
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default page;
