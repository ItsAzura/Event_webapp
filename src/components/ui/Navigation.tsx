import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Navigation = (user: any) => {
  const navItemVariants = {
    hover: {
      scale: 1.05,
      color: '#3b82f6',
      transition: { type: 'spring', stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <nav className="hidden items-center space-x-8 md:flex">
      {[
        { href: '/', label: 'Home' },
        { href: '/events', label: 'Sự kiện' },
        { href: '/about', label: 'Giới thiệu' },
        { href: '/contact', label: 'Liên hệ' },
        ...(user?.role === '1' ? [{ href: '/admin', label: 'Admin' }] : []),
        { href: '/cart', label: 'Giỏ hàng' },
      ].map(item => (
        <motion.div
          key={item.href}
          whileHover="hover"
          whileTap="tap"
          variants={navItemVariants}
        >
          <Link
            href={item.href}
            className="text-base font-medium text-gray-300 transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        </motion.div>
      ))}
    </nav>
  );
};

export default Navigation;
