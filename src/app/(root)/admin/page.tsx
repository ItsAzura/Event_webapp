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
import { motion } from 'framer-motion';

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

  const statsItems = [
    {
      title: 'Total Events',
      value: stats.events,
      icon: <CalendarIcon className="h-5 w-5 text-purple-400" />,
      trendText: '+12.5% from last month',
      trendColor: 'text-green-500',
    },
    {
      title: 'Tickets Sold',
      value: stats.tickets,
      icon: <TicketIcon className="h-5 w-5 text-blue-400" />,
      trendText: '+8.2% from last month',
      trendColor: 'text-green-500',
    },
    {
      title: 'Active Users',
      value: stats.users,
      icon: <UserGroupIcon className="h-5 w-5 text-indigo-400" />,
      trendText: '+5.3% from last month',
      trendColor: 'text-green-500',
    },
    {
      title: 'Total Revenue',
      value: stats.revenue,
      icon: <ChartBarIcon className="h-5 w-5 text-green-400" />,
      trendText: '+10.6% from last month',
      trendColor: 'text-green-500',
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white">
              EventLy{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <input
                type="search"
                placeholder="Search analytics..."
                className="w-64 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pl-10 text-white backdrop-blur-lg transition-all placeholder:text-gray-400 focus:border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
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
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 ring-2 ring-white/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
          className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {statsItems.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-800/20 p-6 backdrop-blur-lg transition-all hover:shadow-2xl"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    {item.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">
                    <CountUp end={item.value} duration={3} />
                  </p>
                </div>
                <div className="rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3 backdrop-blur-lg">
                  {item.icon}
                  <div className="absolute inset-0 -z-10 rounded-full bg-purple-500/10 blur-md" />
                </div>
              </div>
              <div className="relative z-10 mt-4 flex items-center text-sm">
                <ArrowTrendingUpIcon
                  className={`mr-1 h-4 w-4 ${item.trendColor}`}
                />
                <span className={item.trendColor}>{item.trendText}</span>
              </div>
              <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/20 blur-2xl transition-all group-hover:scale-150" />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/10 bg-gray-800/20 p-6 backdrop-blur-lg"
          >
            <h2 className="mb-4 text-xl font-semibold text-white">
              Event Performance
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="events"
                    fill="#7C3AED"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/10 bg-gray-800/20 p-6 backdrop-blur-lg"
          >
            <h2 className="mb-4 text-xl font-semibold text-white">
              Website Traffic
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Additional Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/10 bg-gray-800/20 p-6 backdrop-blur-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">
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
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gray-800/20 p-6 backdrop-blur-lg lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Revenue Overview
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      background: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
