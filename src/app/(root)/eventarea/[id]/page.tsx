'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  TicketIcon,
  MapPinIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EventArea, Ticket } from '@/types/index';
import { getEventAreaById } from '@/services/eventarea/api';
import { getAllTicketsByEventAreaId } from '@/services/ticket/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const EventDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [eventArea, setEventArea] = useState<EventArea>({
    eventAreaID: 0,
    areaName: '',
    capacity: 0,
    price: 0,
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventArea = async () => {
    try {
      const response = await getEventAreaById(Number(id));
      setEventArea(response.data);
    } catch (error) {
      console.error('Fetch event area error:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await getAllTicketsByEventAreaId(Number(id));
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch tickets error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventArea();
    fetchTickets();
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="mb-8 flex items-center text-slate-600 hover:text-slate-800"
        >
          <ArrowLeftIcon className="mr-2 h-6 w-6" />
          Back to Events
        </motion.button>

        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-12"
        >
          <motion.h1
            variants={itemVariants}
            className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent"
          >
            {eventArea.areaName}
          </motion.h1>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-md">
              <TicketIcon className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium text-slate-700">
                {eventArea.capacity} Seats Available
              </span>
            </div>
            <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-md">
              <MapPinIcon className="mr-2 h-5 w-5 text-purple-600" />
              <span className="font-medium text-slate-700">Zone A</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative mb-6 overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity group-hover:opacity-100" />
              <h2 className="relative mb-6 text-3xl font-bold text-slate-800">
                🎟️ Experience Highlights
              </h2>
              <div className="relative space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      Event Schedule
                    </h3>
                    <p className="mt-1 text-slate-600">
                      Friday, 25 October 2024 • 18:00 - 23:00 WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <MapPinIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      Venue Details
                    </h3>
                    <p className="mt-1 text-slate-600">
                      Jakarta International Stadium • VIP Lounge Area
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Ticket Selection */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl"
            >
              <h2 className="mb-6 text-2xl font-bold text-slate-800">
                🎫 Ticket Packages
              </h2>
              <div className="space-y-4">
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.ticketID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative overflow-hidden rounded-xl p-6 ${
                      ticket.status === 'Available'
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'bg-slate-100 opacity-75'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          {ticket.ticketName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {ticket.description}
                        </p>
                      </div>
                      <span
                        className={`ml-2 rounded-full px-3 py-1 text-xs font-medium ${
                          ticket.status === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-slate-900">
                          ${ticket.price}
                        </span>
                        <span className="text-sm text-slate-500">/person</span>
                      </div>
                      <motion.button
                        whileHover={
                          ticket.status === 'Available' ? { scale: 1.05 } : {}
                        }
                        whileTap={
                          ticket.status === 'Available' ? { scale: 0.95 } : {}
                        }
                        className={`rounded-lg px-4 py-2 font-medium ${
                          ticket.status === 'Available'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'cursor-not-allowed bg-slate-300 text-slate-500'
                        }`}
                        disabled={ticket.status !== 'Available'}
                      >
                        {ticket.status === 'Available'
                          ? 'Book Now'
                          : 'Sold Out'}
                      </motion.button>
                    </div>

                    {ticket.status === 'Available' && (
                      <div className="mt-4">
                        <div className="mb-2 flex justify-between text-sm font-medium">
                          <span>Remaining:</span>
                          <span>
                            {ticket.quantity}/{eventArea.capacity}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{
                              width: `${
                                (ticket.quantity / eventArea.capacity) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Guidelines Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl"
        >
          <h2 className="mb-6 text-2xl font-bold">📜 Event Guidelines</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: '🎟️',
                title: 'Ticket Policy',
                content: 'E-tickets must be presented at entrance',
              },
              {
                icon: '⏰',
                title: 'Arrival Time',
                content: 'Gates open 2 hours before showtime',
              },
              {
                icon: '📸',
                title: 'Photography',
                content: 'Professional cameras allowed in VIP areas',
              },
              {
                icon: '👕',
                title: 'Dress Code',
                content: 'Smart casual attire required',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex items-start rounded-xl bg-white/10 p-6 backdrop-blur-sm"
              >
                <span className="mr-4 text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm opacity-90">{item.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventDetailPage;
