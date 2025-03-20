'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';
import Navigation from '../ui/Navigation';

const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
    },
  },
};

const dropdownVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const Header = () => {
  const { accessToken, logout } = useAuthStore();
  const user = decodeAccessToken(accessToken);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 border-b border-white/10 bg-gray-900/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo với hiệu ứng gradient */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2"
        >
          <Link href="/" className="relative">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent">
              Eventify
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-cyan-500/30 blur-xl" />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <Navigation user={user} />

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <motion.div
              className="relative"
              onHoverStart={() => setIsDropdownOpen(true)}
              onHoverEnd={() => setIsDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-3 rounded-full p-1 pr-3 transition-colors hover:bg-white/10"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar
                  src={user.avatarUrl}
                  fallback={user.userName}
                  alt={user.userName}
                />
                <span className="text-sm font-medium text-white">
                  {user.userName}
                </span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="absolute right-2 mt-2 w-48 origin-top-right rounded-xl bg-gray-800/95 p-2 shadow-2xl backdrop-blur-xl"
                  >
                    {[
                      { href: '/profile', label: 'Profile' },
                      { href: '/my-events', label: 'My Events' },
                      { href: '/my-ticket', label: 'My Tickets' },
                    ].map(item => (
                      <motion.div
                        key={item.href}
                        whileHover={{ scale: 1.02 }}
                        className="rounded-lg hover:bg-white/5"
                      >
                        <Link
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-gray-200"
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={logout}
                      className="mt-2 w-full rounded-lg bg-red-500/10 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/20"
                    >
                      Đăng xuất
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login">
                  <Button className="text-white">Đăng nhập</Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
                    Đăng ký
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 top-full w-full bg-gray-900/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-4 p-6">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/events', label: 'Sự kiện' },
                  { href: '/about', label: 'Giới thiệu' },
                  { href: '/contact', label: 'Liên hệ' },
                  ...(user?.role === '1'
                    ? [{ href: '/admin', label: 'Admin' }]
                    : []),
                  { href: '/cart', label: 'Giỏ hàng' },
                ].map(item => (
                  <motion.div key={item.href} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={item.href}
                      className="block py-2 text-lg text-gray-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
