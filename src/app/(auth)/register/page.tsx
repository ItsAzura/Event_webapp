'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { RegisterData } from '@/types/index';
import { toast } from 'react-toastify';
import { RegisterSchema } from '@/schemas/authSchema';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { register } from '@/services/auth/api';

const Register = () => {
  const [userData, setUserData] = useState<RegisterData>({
    userName: '',
    email: '',
    passwordHash: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);

  if (user) {
    window.location.href = '/';
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (userData.passwordHash !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    try {
      const result = RegisterSchema.safeParse(userData);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }

      await register(userData);

      toast.success('Đăng ký thành công');
      setUserData({ userName: '', email: '', passwordHash: '' });
      setConfirmPassword('');

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Left Column - Graphic Section */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/bg.jpg"
          alt="Event Background"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="px-20 text-white">
            <h1 className="mb-6 text-5xl font-bold">
              Tham Gia Cộng Đồng Sự Kiện
            </h1>
            <p className="text-xl opacity-90">
              Mở khóa quyền lợi thành viên và ưu đãi đặc biệt dành riêng cho bạn
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl transition-all duration-300 hover:shadow-2xl">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-lg bg-purple-600 p-3">
              <span className="text-2xl font-bold text-white">EVENTLY</span>
            </div>
          </div>

          {/* Form Title */}
          <h2 className="mb-2 text-center text-4xl font-semibold text-gray-900">
            Tạo Tài Khoản Mới
          </h2>
          <p className="mb-8 text-center text-sm text-gray-600">
            Đăng ký để nhận ưu đãi thành viên
          </p>

          {/* Social Login */}
          <div className="mb-8 flex gap-4">
            <button className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 48 48"
              >
                <g fillRule="evenodd" clipRule="evenodd">
                  <path d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" />
                  <path d="M19.1833 45.4716C18.9898 45.2219 18.9898 42.9973 19.1833 38.798C17.1114 38.8696 15.8024 38.7258 15.2563 38.3667C14.437 37.828 13.6169 36.1667 12.8891 34.9959C12.1614 33.8251 10.5463 33.64 9.89405 33.3783C9.24182 33.1165 9.07809 32.0496 11.6913 32.8565C14.3044 33.6634 14.4319 35.8607 15.2563 36.3745C16.0806 36.8883 18.0515 36.6635 18.9448 36.2519C19.8382 35.8403 19.7724 34.3078 19.9317 33.7007C20.1331 33.134 19.4233 33.0083 19.4077 33.0037C18.5355 33.0037 13.9539 32.0073 12.6955 27.5706C11.437 23.134 13.0581 20.2341 13.9229 18.9875C14.4995 18.1564 14.4485 16.3852 13.7699 13.6737C16.2335 13.3589 18.1347 14.1343 19.4734 16.0001C19.4747 16.0108 21.2285 14.9572 24.0003 14.9572C26.772 14.9572 27.7553 15.8154 28.5142 16.0001C29.2731 16.1848 29.88 12.7341 34.5668 13.6737C33.5883 15.5969 32.7689 18.0001 33.3943 18.9875C34.0198 19.9749 36.4745 23.1147 34.9666 27.5706C33.9614 30.5413 31.9853 32.3523 29.0384 33.0037C28.7005 33.1115 28.5315 33.2855 28.5315 33.5255C28.5315 33.8856 28.9884 33.9249 29.6465 35.6117C30.0853 36.7362 30.117 39.948 29.7416 45.247C28.7906 45.4891 28.0508 45.6516 27.5221 45.7347C26.5847 45.882 25.5669 45.9646 24.5669 45.9965C23.5669 46.0284 23.2196 46.0248 21.837 45.8961C20.9154 45.8103 20.0308 45.6688 19.1833 45.4716Z" />
                </g>
              </svg>
            </button>
            <button className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#ffc107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
                />
                <path
                  fill="#ff3d00"
                  d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
                />
                <path
                  fill="#4caf50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
                />
                <path
                  fill="#1976d2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
                />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">
                hoặc dùng email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Họ và Tên
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-black outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  placeholder="Nguyễn Văn A"
                  value={userData.userName}
                  onChange={e =>
                    setUserData({ ...userData, userName: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Địa chỉ Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-black outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  placeholder="email@example.com"
                  value={userData.email}
                  onChange={e =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-black outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  value={userData.passwordHash}
                  onChange={e =>
                    setUserData({ ...userData, passwordHash: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Xác nhận Mật khẩu
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-black outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full transform rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-blue-600"
            >
              Đăng Ký Ngay
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="font-semibold text-purple-600 hover:text-purple-500"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
