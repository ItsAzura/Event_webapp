'use client';

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  TicketIcon,
  CalendarIcon,
  UserGroupIcon,
  InboxArrowDownIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import CountUp from 'react-countup';

// Generate random data functions
const generateChartData = () => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
    name: month,
    events: Math.floor(Math.random() * 100) + 50,
    visitors: Math.floor(Math.random() * 1000) + 500,
    revenue: Math.floor(Math.random() * 10000) + 5000,
  }));
};

const generatePieData = () => {
  const categories = ['Music', 'Sports', 'Tech', 'Art', 'Business'];
  return categories.map(category => ({
    name: category,
    value: Math.floor(Math.random() * 1000) + 100,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
  }));
};

export default function AdminDashboard() {
  const [chartData, setChartData] = useState(generateChartData());
  const [pieData, setPieData] = useState(generatePieData());
  const [stats, setStats] = useState({
    events: 0,
    tickets: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Simulate data fetching
    setStats({
      events: Math.floor(Math.random() * 500) + 100,
      tickets: Math.floor(Math.random() * 10000) + 5000,
      users: Math.floor(Math.random() * 10000) + 2000,
      revenue: Math.floor(Math.random() * 100000) + 50000,
    });
  }, []);

  return (
    <div className="min-screen bg-gradient-to-r from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              EventLy Dashboard
            </h1>
            <p className="text-gray-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search analytics..."
                className="w-64 rounded-xl border-0 bg-white px-4 py-2.5 pl-10 shadow-sm ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-600 ring-2 ring-white transition-all hover:ring-purple-300"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Events */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Events
                </p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  <CountUp end={stats.events} duration={3} />
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <CalendarIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
              <span>12% from last month</span>
            </div>
          </div>

          {/* Tickets Sold */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Tickets Sold
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  <CountUp end={stats.tickets} duration={3} separator="," />
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <TicketIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
              <span>23% from last month</span>
            </div>
          </div>

          {/* Active Users */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Users
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  <CountUp end={stats.users} duration={3} separator="," />
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
              <span>5% from last month</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="mt-2 text-3xl font-bold text-orange-600">
                  $<CountUp end={stats.revenue} duration={3} separator="," />
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <ChartBarIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="mr-1 h-4 w-4" />
              <span>18% from last month</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Event Performance
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Website Traffic
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Ticket Sales Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Revenue Overview
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
