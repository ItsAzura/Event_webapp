'use client';
import { useState, useEffect, JSX } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { getEvents, eventApprove, eventReject } from '@/services/admin/api';
import { toast } from 'react-toastify';

interface Event {
  eventID: number;
  eventName: string;
  createdBy: string;
  eventDate: string;
  eventStatus: 'Pending' | 'Approved' | 'Rejected';
}

interface ApiResponse {
  map(arg0: (event: any) => JSX.Element): unknown;
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
        console.log(response);
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

  console.log(data);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Event Management Dashboard
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full rounded-lg border py-2 pl-10 pr-4 text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : (
              <>
                {data &&
                  data?.events.map(event => (
                    <div
                      key={event.eventID}
                      className="p-6 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {event.eventName}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                event.eventStatus === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : event.eventStatus === 'Approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {event.eventStatus}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <UserGroupIcon className="h-4 w-4" />
                              <span>{event.createdBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {new Date(event.eventDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(event.eventID)}
                            className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                            disabled={event.eventStatus === 'Approved'}
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(event.eventID)}
                            className="flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                            disabled={event.eventStatus === 'Rejected'}
                          >
                            <XCircleIcon className="h-5 w-5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}

            {/* Pagination */}
            {data && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, data.totalCount)} of{' '}
                    {data.totalCount} results
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-md border px-3 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(p => Math.min(data.totalPages, p + 1))
                      }
                      disabled={currentPage === data.totalPages}
                      className="rounded-md border px-3 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
