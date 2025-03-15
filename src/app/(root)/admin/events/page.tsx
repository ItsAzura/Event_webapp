'use client';
import { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { getEvents, eventApprove, eventReject } from '@/services/admin/api';
import { toast } from 'react-toastify';
import { Event } from '@/types/index';

interface ApiResponse {
  map(arg0: (event: Event) => JSX.Element): unknown;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  events: Event[];
}

export default function EventManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data khi các tham số thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await getEvents(params.toString());
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery]);

  const handleApprove = async (id: number) => {
    try {
      await eventApprove(id.toString());
      toast.success('Event approved successfully');
      setCurrentPage(1);
    } catch (err) {
      toast.error('Failed to approve event');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await eventReject(id.toString());
      toast.success('Event rejected successfully');
      setCurrentPage(1);
    } catch (err) {
      toast.error('Failed to reject event');
    }
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-gray-900/50 backdrop-blur-lg"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            Event Management{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
        </div>
      </motion.header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 rounded-xl border border-white/10 bg-gray-900/30 p-6 backdrop-blur-lg"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-12 py-3 text-white backdrop-blur-lg transition-all placeholder:text-gray-400 focus:border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Event List */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900/30 backdrop-blur-lg">
          <div className="divide-y divide-white/10">
            {loading ? (
              // Skeleton Loading
              <div className="space-y-6 p-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl bg-gray-800/50"
                  />
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {data?.events.map(event => (
                  <motion.div
                    key={event.eventID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 transition-colors hover:bg-gray-800/20"
                  >
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-white">
                            {event.eventName}
                          </h3>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              event.eventStatus === 'Pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : event.eventStatus === 'Approved'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {event.eventStatus}
                          </motion.span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="h-5 w-5 text-purple-400" />
                            <span>{event.createdBy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-blue-400" />
                            <span>
                              {new Date(event.eventDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(event.eventID)}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-green-500/30 disabled:opacity-50"
                          disabled={event.eventStatus === 'Approved'}
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(event.eventID)}
                          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-red-500/30 disabled:opacity-50"
                          disabled={event.eventStatus === 'Rejected'}
                        >
                          <XCircleIcon className="h-5 w-5" />
                          Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Pagination */}
            {data && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-white/10 px-6 py-4"
              >
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <span className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, data.totalCount)} of{' '}
                    {data.totalCount} results
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-lg transition-all hover:bg-white/10 disabled:opacity-50"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setCurrentPage(p => Math.min(data.totalPages, p + 1))
                      }
                      disabled={currentPage === data.totalPages}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-lg transition-all hover:bg-white/10 disabled:opacity-50"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
