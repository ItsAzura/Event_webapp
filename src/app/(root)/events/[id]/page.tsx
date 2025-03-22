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
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { useState, useEffect } from 'react';
import { Event, EventArea, feedBack } from '@/types/index';
import Link from 'next/link';
import {
  getFeedbackByEventId,
  createFeedback,
  deleteFeedback,
} from '@/services/feedback/api';
import { PlusIcon, StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

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
  const { accessToken } = useAuthStore();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id?: string | number;
  } | null>(null);
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
  const [feedbacks, setFeedbacks] = useState<feedBack[]>([]);
  const [isAddingFeedback, setIsAddingFeedback] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    comment: '',
    rating: 5,
  });
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<number | null>(
    null,
  );
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(true);

  const fetchEvent = async () => {
    try {
      const response = await getEventById(Number(id));

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

  const fetchFeedbacks = async () => {
    try {
      setIsLoadingFeedbacks(true);
      const response = await getFeedbackByEventId(Number(id));
      setFeedbacks(response);
    } catch (error) {
      console.error('Fetch feedback error:', error);
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      const decoded = decodeAccessToken(accessToken);
      setCurrentUser(decoded);
      setIsUserLoading(false);
    } else {
      setIsUserLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchEvent();
    fetchEventAreas();
    fetchFeedbacks();
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    const feedbackData = {
      eventID: Number(id),
      userID: currentUser?.id,
      comment: newFeedback.comment,
      rating: newFeedback.rating,
    };

    try {
      const response = await createFeedback(feedbackData);
      console.log('Feedback response:', response);
      if (!response.success) {
        toast.error('Failed to submit feedback');
        return;
      }
      toast.success('Feedback submitted successfully!');
      setNewFeedback({ comment: '', rating: 5 });
      setIsAddingFeedback(false);
      fetchFeedbacks(); // Refresh feedbacks after adding a new one
    } catch (error) {
      console.error('Submit feedback error:', error);
    }
  };

  const handleDeleteFeedback = async (feedbackId: number) => {
    try {
      const response = await deleteFeedback(feedbackId);
      if (response.success) {
        toast.success('Feedback deleted successfully!');
        setFeedbacks(feedbacks.filter(fb => fb.id !== feedbackId));
      } else {
        toast.error(response.message || 'Failed to delete feedback');
      }
    } catch (error) {
      console.error('Delete feedback error:', error);
      toast.error('An error occurred while deleting feedback');
    }
  };

  {
    if (isUserLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      );
    }
  }

  {
    feedbacks.map(feedback => {
      // Debug cho từng feedback
      console.log('Debugging feedback:', {
        currentUserId: currentUser?.id,
        feedbackUserId: feedback.userId,
        currentUserIdType: typeof currentUser?.id,
        feedbackUserIdType: typeof feedback.userId,
        equalityCheck:
          currentUser?.id?.toString() == feedback.userId?.toString(),
      });
    });
  }

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

      {/* Feedback Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Feedbacks</h2>
            <button
              onClick={() => setIsAddingFeedback(true)}
              className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Feedback
            </button>
          </div>

          {/* Feedback Form Modal */}
          {isAddingFeedback && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Add New Feedback
              </h3>
              <form onSubmit={handleSubmitFeedback}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newFeedback.rating}
                    onChange={e =>
                      setNewFeedback({
                        ...newFeedback,
                        rating: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full rounded-md border p-2 text-gray-800"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Comment
                  </label>
                  <textarea
                    value={newFeedback.comment}
                    onChange={e =>
                      setNewFeedback({
                        ...newFeedback,
                        comment: e.target.value,
                      })
                    }
                    className="w-full rounded-md border p-2 text-gray-800"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingFeedback(false)}
                    className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Feedback List */}
          {feedbacks?.length > 0 ? (
            <div className="space-y-4">
              {feedbacks.map(feedback => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        User #{feedback.userId}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < feedback.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600">{feedback.comment}</p>
                  {!isUserLoading &&
                    currentUser?.id &&
                    feedback.userId &&
                    currentUser.id.toString() ===
                      feedback.userId.toString() && (
                      <button
                        onClick={() => setDeletingFeedbackId(feedback.id)}
                        className="absolute right-2 top-2 z-10 p-1 text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No feedbacks yet</p>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingFeedbackId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-lg bg-white p-6"
          >
            <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this feedback? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingFeedbackId(null)}
                className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteFeedback(deletingFeedbackId);
                  setDeletingFeedbackId(null);
                }}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default page;
