'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

const Header = () => {
  const { accessToken, logout } = useAuthStore();
  const user = decodeAccessToken(accessToken);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-gray-700/20 bg-gray-800/70 p-4 backdrop-blur-lg">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        Eventify
      </Link>

      <nav className="space-x-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link href="/events" className="hover:text-blue-600">
          Sự kiện
        </Link>
        <Link href="/about" className="hover:text-blue-600">
          Giới thiệu
        </Link>
        <Link href="/contact" className="hover:text-blue-600">
          Liên hệ
        </Link>
        {user && user.role === '1' && (
          <Link href="/admin" className="hover:text-blue-600">
            Admin
          </Link>
        )}
      </nav>

      <div>
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="flex cursor-pointer items-center space-x-4">
              <Avatar src={user.avatarUrl} fallback={user.userName} />
              <span>{user.userName}</span>
            </div>

            {isDropdownOpen && (
              <div className="z-100 absolute right-14 mt-0 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/my-events"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  My Events
                </Link>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login">
              <Button>Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary">Đăng ký</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
