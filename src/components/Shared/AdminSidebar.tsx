'use client';

import React, { useState } from 'react';
import {
  CalendarIcon,
  HomeIcon,
  InboxArrowDownIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-purple-800 p-2 text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-900 p-6 shadow-xl transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:block`}
      >
        {/* Sidebar Header */}
        <div className="mb-8 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-purple-600"></div>
          <div>
            <h2 className="text-xl font-bold text-white">Event Horizon</h2>
            <p className="text-sm text-purple-200">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center space-x-3 rounded-xl px-4 py-3 text-gray-200 transition-all hover:bg-purple-800 hover:text-white"
          >
            <HomeIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="/admin/events"
            className="flex items-center space-x-3 rounded-xl px-4 py-3 text-gray-200 transition-all hover:bg-purple-800 hover:text-white"
          >
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Events</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center space-x-3 rounded-xl px-4 py-3 text-gray-200 transition-all hover:bg-purple-800 hover:text-white"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Users</span>
          </Link>
          <Link
            href="/admin/answer"
            className="flex items-center space-x-3 rounded-xl px-4 py-3 text-gray-200 transition-all hover:bg-purple-800 hover:text-white"
          >
            <InboxArrowDownIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Answer Contact</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
