'use client';

import React, { useState, useEffect } from 'react';
import {
  TicketIcon,
  CalendarIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { getRegistrationByUserId } from '@/services/registration/api';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { Registration } from '@/types/index';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclaimationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

const MyTickets = () => {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRegistrations = async () => {
    try {
      if (user?.id) {
        const response = await getRegistrationByUserId(user.id.toString());
        console.log('Response:', response);

        if (!response) {
          throw new Error('No registrations found');
        }

        setRegistrations(response);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const loadingCircleVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const errorShake = {
    initial: { x: -10, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
        repeat: 1,
        repeatType: 'mirror' as const,
      },
    },
    exit: { opacity: 0 },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900"
      >
        <motion.div
          variants={loadingContainerVariants}
          initial="start"
          animate="end"
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: { duration: 1, repeat: Infinity, ease: 'linear' },
            }}
            className="relative h-12 w-12"
          >
            <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30"></div>
            <motion.div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent"></motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 font-medium text-cyan-100"
          >
            <span>Loading Tickets</span>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ...
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <AnimatePresence>
        <motion.div
          variants={errorShake}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4"
        >
          <div className="flex max-w-md flex-col items-center rounded-xl border border-red-400/30 bg-red-500/20 p-6 backdrop-blur-lg">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-4"
            >
              <ExclaimationTriangleIcon className="h-12 w-12 text-red-400" />
            </motion.div>

            <h2 className="mb-2 text-xl font-semibold text-red-100">
              Oops! Something went wrong
            </h2>
            <p className="text-center text-red-200">{error.message}</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 flex items-center space-x-2 rounded-full bg-red-400/20 px-6 py-2 text-red-100 transition-all hover:bg-red-400/30"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Try Again</span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center text-4xl font-bold text-white"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <TicketIcon className="mr-3 h-9 w-9 text-cyan-400" />
          </motion.div>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            My Digital Passes
          </span>
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {registrations.map(registration => (
            <motion.div
              key={registration.registrationID}
              variants={itemVariants}
              className="group mb-6 overflow-hidden rounded-2xl bg-white/5 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:bg-white/10"
            >
              <div className="p-6">
                {/* Registration Header */}
                <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                  <motion.div whileHover={{ x: 5 }}>
                    <h2 className="text-xl font-semibold text-cyan-400">
                      Order #{registration.registrationID}
                    </h2>
                    <div className="mt-1 flex items-center text-sm text-gray-300">
                      <CalendarIcon className="mr-1.5 h-5 w-5 text-purple-300" />
                      <span>{formatDate(registration.registrationDate)}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 px-4 py-2 text-sm font-medium text-white"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Paid on {formatDate(registration.paymentDate)}</span>
                  </motion.div>
                </div>

                {/* Ticket Items */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {registration.registrationDetails.map(detail => (
                    <motion.div
                      key={detail.registrationDetailID}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm transition-all hover:border-cyan-400/30"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-cyan-100">
                            {detail.ticket.ticketName}
                          </h3>
                          <p className="mt-1 text-sm text-gray-300">
                            {detail.ticket.description}
                          </p>
                        </div>
                        <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-sm font-medium text-cyan-400">
                          x{detail.quantity}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">
                            Price per ticket
                          </span>
                          <span className="font-mono text-cyan-300">
                            ${detail.ticket.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Total</span>
                          <span className="font-mono text-lg font-bold text-cyan-400">
                            ${detail.ticket.price * detail.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Hover effect */}
                      <div
                        className="bg-[radial-gradient(200px_circle_at_var(--x,_100px)_var(--y,_100px),#0ff1]/10 absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
                        style={
                          {
                            '--x': '100px',
                            '--y': '100px',
                          } as React.CSSProperties
                        }
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Total Price */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/10 pt-4"
                >
                  <div className="flex justify-end">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total amount</p>
                      <p className="font-mono text-2xl font-bold text-cyan-400">
                        $
                        {registration.registrationDetails.reduce(
                          (sum, detail) =>
                            sum + detail.ticket.price * detail.quantity,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MyTickets;
