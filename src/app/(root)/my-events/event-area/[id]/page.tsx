'use client';

import { useState, useEffect } from 'react';
import { EventArea, Ticket } from '@/types/index';
import { useParams } from 'next/navigation';
import {
  getEventAreaById,
  updateEventArea,
  deleteEventArea,
} from '@/services/eventarea/api';
import { toast } from 'react-toastify';
import {
  getAllTicketsByEventAreaId,
  createTicket,
  activeTicket,
  unactiveTicket,
  updateTicket,
  deleteTicket,
} from '@/services/ticket/api';
import { motion } from 'framer-motion';

const EventAreaDetail = () => {
  const params = useParams();
  const { id } = params;
  const [eventArea, setEventArea] = useState<EventArea | null>({
    eventAreaID: 0,
    areaName: '',
    capacity: 0,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    areaName: '',
    capacity: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [ticket, setTicket] = useState<Ticket[]>();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    ticketName: '',
    price: 0,
    quantity: 0,
    description: '',
  });

  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const [isDeleteTicketModalOpen, setIsDeleteTicketModalOpen] = useState(false);
  const [editingTicketID, setEditingTicketID] = useState<number | null>(null);
  const [deletingTicketID, setDeletingTicketID] = useState<number | null>(null);

  const fetchEventArea = async () => {
    try {
      const response = await getEventAreaById(Number(id));
      console.log('Event Area:', response.data);
      setEventArea(response.data);
    } catch (error) {
      console.error('Fetch event area error:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await updateEventArea(editData, id.toString());

      console.log('Update response:', response);

      if (response.status === 200) {
        toast.success('Event area updated successfully');
        await fetchEventArea();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update event area');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteEventArea(id.toString());

      if (response.status === 200) {
        toast.success('Event area deleted successfully');
        setTimeout(() => {
          window.location.href = '/my-events';
        }, 1000);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete event area');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await getAllTicketsByEventAreaId(Number(id));
      if (response.status !== 200) {
        toast.error('Failed to fetch tickets');
        return;
      }
      setTicket(response.data);
    } catch (error) {
      console.error('Fetch tickets error:', error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingTicket(true);

    try {
      const response = await createTicket({
        eventAreaID: Number(id),
        ticketName: newTicket.ticketName,
        description: newTicket.description,
        quantity: newTicket.quantity,
        price: newTicket.price,
      });
      console.log('Create ticket response:', response);

      if (response.status === 200) {
        toast.success('Ticket created successfully');
        await fetchTickets();
        setIsTicketModalOpen(false);
      }
    } catch (error: any) {
      console.error('Create ticket error:', error);
      toast.error(error.response.data);
    } finally {
      setIsCreatingTicket(false);
    }
  };

  useEffect(() => {
    fetchEventArea();
    fetchTickets();
  }, [id]);

  useEffect(() => {
    if (eventArea) {
      setEditData({
        areaName: eventArea.areaName || '',
        capacity: eventArea.capacity || 0,
      });
    }
  }, [eventArea]);

  function onToggleStatus(ticketID: number): void {
    const ticketToToggle = ticket?.find(t => t.ticketID === ticketID);
    if (!ticketToToggle) return;

    if (ticketToToggle.status === 'Unavailable') {
      activeTicket(ticketID).then(() => {
        toast.success('Ticket activated successfully');
        fetchTickets();
      });
    } else {
      unactiveTicket(ticketID).then(() => {
        toast.success('Ticket deactivated successfully');
        fetchTickets();
      });
    }
  }

  const handleEditTicket = (ticketID: number) => {
    const ticketToEdit = ticket?.find(t => t.ticketID === ticketID);
    if (!ticketToEdit) return;

    setNewTicket({
      ticketName: ticketToEdit.ticketName,
      price: ticketToEdit.price,
      quantity: ticketToEdit.quantity,
      description: ticketToEdit.description,
    });

    setEditingTicketID(ticketID);
    setIsEditTicketModalOpen(true);
  };

  const handleConfirmEditTicket = async () => {
    if (editingTicketID === null) return;

    setIsEditTicketModalOpen(false);
    try {
      const response = await updateTicket(
        newTicket,
        editingTicketID.toString(),
      );
      if (response.status === 200) {
        toast.success('Ticket updated successfully');
        fetchTickets();
      }
    } catch (error) {
      console.error('Update ticket error:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleDeleteTicket = (ticketID: number) => {
    setDeletingTicketID(ticketID);
    setIsDeleteTicketModalOpen(true);
  };

  const handleConfirmDeleteTicket = async () => {
    if (deletingTicketID === null) return;

    setIsDeleteTicketModalOpen(false);
    try {
      const response = await deleteTicket(deletingTicketID);
      if (response.status === 200) {
        toast.success('Ticket deleted successfully');
        fetchTickets();
      }
    } catch (error) {
      console.error('Delete ticket error:', error);
      toast.error('Failed to delete ticket');
    }
  };

  useEffect(() => {
    if (!isEditTicketModalOpen) {
      setEditingTicketID(null);
      setNewTicket({
        ticketName: '',
        price: 0,
        quantity: 0,
        description: '',
      });
    }
  }, [isEditTicketModalOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="relative animate-[slideUp_0.5s_ease-out] rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 hover:shadow-xl md:p-8">
          {eventArea && (
            <div className="space-y-8">
              {/* Header Section với animated underline */}
              <div className="group relative pb-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800 transition-all duration-300 hover:text-indigo-600">
                      {eventArea.areaName}
                    </h1>
                    <p className="mt-2 font-medium text-indigo-500">
                      Event Area Details
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white transition-all duration-300 hover:scale-95 hover:bg-indigo-700 hover:shadow-lg"
                    >
                      <svg
                        className="h-5 w-5 animate-pulse"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-white transition-all duration-300 hover:scale-95 hover:bg-rose-700 hover:shadow-lg"
                    >
                      <svg
                        className="h-5 w-5 animate-pulse"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 h-1 w-24 bg-gradient-to-r from-indigo-400 to-blue-400 transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Detail Section với staggered animation */}
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="animate-[fadeInLeft_0.5s_ease-out]">
                    <label className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                      Area ID
                    </label>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="rounded-lg bg-indigo-100 px-3 py-1.5 font-mono text-2xl font-bold text-indigo-600">
                        #{eventArea.eventAreaID}
                      </span>
                    </div>
                  </div>

                  <div className="animate-[fadeInLeft_0.5s_ease-out_0.1s]">
                    <label className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                      Capacity
                    </label>
                    <div className="mt-2 flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-16 w-16 animate-[spin_3s_linear_infinite]">
                          <svg
                            viewBox="0 0 100 100"
                            className="text-indigo-100"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="currentColor"
                              strokeWidth="10"
                              fill="none"
                            />
                          </svg>
                        </div>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-indigo-600">
                          {eventArea.capacity}
                        </span>
                      </div>
                      <span className="text-lg font-medium text-gray-500">
                        People Capacity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="animate-[fadeInRight_0.5s_ease-out]">
                  <div className="border-l-4 border-indigo-200 pl-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-800">
                      <span className="mr-2 text-indigo-500">✦</span>
                      Space Features
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                        <span>Flexible Layout Options</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                        <span>Advanced AV Systems</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                        <span>Climate Control</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stats Preview với hover animation */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="animate-[fadeInUp_0.5s_ease-out_0.2s]">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-5 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute -right-4 -top-4 h-16 w-16 animate-pulse rounded-full bg-indigo-200 opacity-30" />
                    <p className="text-sm font-medium text-indigo-600">
                      Upcoming Events
                    </p>
                    <p className="mt-2 text-3xl font-bold text-indigo-700">
                      12
                    </p>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-indigo-100">
                      <div className="h-full w-3/4 animate-[progress_1.5s_ease-out] rounded-full bg-indigo-400" />
                    </div>
                  </div>
                </div>
                <div className="animate-[fadeInUp_0.5s_ease-out_0.3s]">
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-5 transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute -right-4 -top-4 h-16 w-16 animate-pulse rounded-full bg-green-200 opacity-30" />
                    <p className="text-sm font-medium text-green-600">
                      Available Dates
                    </p>
                    <p className="mt-2 text-3xl font-bold text-green-700">24</p>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-green-100">
                      <div className="h-full w-1/2 animate-[progress_1.5s_ease-out] rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">Ticket Types</h3>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white transition-all duration-300 hover:scale-95 hover:bg-green-700 hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Ticket
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ticket && ticket.length > 0 ? (
            ticket.map(t => (
              <motion.div
                key={t.ticketID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                {/* Fix: Thêm pointer-events-none để không chặn nút */}
                <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent transition-all group-hover:border-indigo-300" />

                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {t.ticketName}
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">
                    {t.status === 'Unavailable' ? (
                      <span className="text-red-500">Unavailable</span>
                    ) : (
                      <span className="text-green-500">Available</span>
                    )}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="font-medium text-indigo-600">
                      ${t.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Available:</span>
                    <span className="font-medium text-green-600">
                      {t.quantity}
                    </span>
                  </div>
                </div>

                {t.description && (
                  <p className="mt-4 text-sm text-gray-600">{t.description}</p>
                )}

                {/* Fix: Đảm bảo nút có thể click */}
                <div className="relative z-10 mt-6 flex items-center justify-between">
                  {/* Nút hành động (Edit, Delete) */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleEditTicket(t.ticketID)}
                      whileHover={{ scale: 1.1, rotate: 12 }}
                      className="rounded-full bg-indigo-600 p-2 text-white transition-all duration-300 hover:bg-indigo-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </motion.button>

                    <motion.button
                      onClick={() => handleDeleteTicket(t.ticketID)} // Thêm dòng này
                      whileHover={{ scale: 1.1, rotate: -12 }}
                      className="rounded-full bg-rose-600 p-2 text-white transition-all duration-300 hover:bg-rose-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Nút Kích Hoạt/ Hủy Kích Hoạt */}
                  <motion.button
                    onClick={() => onToggleStatus(t.ticketID)}
                    whileTap={{ scale: 0.9 }}
                    className={`rounded-lg px-4 py-2 text-white transition-all duration-300 ${
                      t.status === 'Unavailable'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {t.status === 'Unavailable' ? 'Activate' : 'Deactivate'}
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-gray-500">
              No tickets available yet
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-modalEnter w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Event Area
            </h2>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Area Name
                </label>
                <input
                  type="text"
                  required
                  value={editData.areaName}
                  onChange={e =>
                    setEditData(prev => ({
                      ...prev,
                      areaName: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editData.capacity || ''}
                  onChange={e =>
                    setEditData(prev => ({
                      ...prev,
                      capacity: Number(e.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      {/* ... spinner SVG ... */}
                    </svg>
                  )}
                  Update Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-modalEnter w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">Confirm Delete</h2>
            <p className="mt-4 text-gray-600">
              Are you sure you want to delete "{eventArea?.areaName}"? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-modalEnter w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Ticket
            </h2>

            <form onSubmit={handleCreateTicket} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ticket Name
                </label>
                <input
                  type="text"
                  required
                  value={newTicket.ticketName}
                  onChange={e =>
                    setNewTicket(prev => ({
                      ...prev,
                      ticketName: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newTicket.price}
                    onChange={e =>
                      setNewTicket(prev => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newTicket.quantity}
                    onChange={e =>
                      setNewTicket(prev => ({
                        ...prev,
                        quantity: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={e =>
                    setNewTicket(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={isCreatingTicket}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                  disabled={isCreatingTicket}
                >
                  {isCreatingTicket && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      {/* Spinner SVG */}
                    </svg>
                  )}
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {isEditTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-modalEnter w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">Edit Ticket</h2>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleConfirmEditTicket();
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ticket Name
                </label>
                <input
                  type="text"
                  required
                  value={newTicket.ticketName}
                  onChange={e =>
                    setNewTicket(prev => ({
                      ...prev,
                      ticketName: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newTicket.price}
                    onChange={e =>
                      setNewTicket(prev => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newTicket.quantity}
                    onChange={e =>
                      setNewTicket(prev => ({
                        ...prev,
                        quantity: Number(e.target.value),
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ticket Description
                </label>
                <input
                  type="text"
                  required
                  value={newTicket.description}
                  onChange={e =>
                    setNewTicket(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditTicketModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      {/* ... spinner SVG ... */}
                    </svg>
                  )}
                  Update Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Ticket Modal */}
      {isDeleteTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="animate-modalEnter w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">Confirm Delete</h2>
            <p className="mt-4 text-gray-600">
              Are you sure you want to delete this Ticket ? action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteTicketModalOpen(false)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTicket}
                className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAreaDetail;
