'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

const Header = () => {
  const { accessToken, logout } = useAuthStore();
  const user = decodeAccessToken(accessToken);

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
          <div className="flex items-center space-x-4">
            <Avatar src={user.avatarUrl} fallback={user.userName} />
            <span>{user.userName}</span>
            <Button onClick={logout} variant="secondary">
              Đăng xuất
            </Button>
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
