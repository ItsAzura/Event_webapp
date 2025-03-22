'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { getProfile, updateProfile } from '@/services/profile/api';
import type { Profile } from '@/types/index';
import { motion } from 'framer-motion';
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface EditForm {
  userName: string;
  email: string;
  passwordHash: string;
  roleID: number;
  confirmPassword?: string;
}

const Profile = () => {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);

  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditForm>({
    userName: '',
    email: '',
    passwordHash: '',
    roleID: 2,
    confirmPassword: '',
  });

  const getRoleLabel = (roleID: number) => {
    const roles = {
      1: 'Quản trị viên',
      2: 'Người dùng',
    };
    return roles[roleID as keyof typeof roles] || 'Không xác định';
  };

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const response = await getProfile(user.id);
      setProfile(response);
      // Initialize edit form with current profile data
      setEditData({
        userName: response.userName,
        email: response.email,
        passwordHash: '',
        roleID: response.roleID,
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const validateForm = () => {
    if (
      editData.passwordHash &&
      editData.passwordHash !== editData.confirmPassword
    ) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!editData.userName || !editData.email) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;

    try {
      const payload = {
        userName: editData.userName,
        email: editData.email,
        passwordHash: editData.passwordHash,
        roleID: editData.roleID,
      };

      const updatedProfile = await updateProfile(user.id.toString(), payload);

      setProfile(prev => ({
        ...prev,
        ...updatedProfile,
        // Keep existing password hash if not changed
      }));

      alert('Cập nhật thành công!');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Vui lòng đăng nhập</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 px-4 py-12 sm:px-6 lg:px-8">
      {profile && (
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-red-300">
                {error}
              </div>
            )}

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute right-6 top-6 flex items-center space-x-2 rounded-full bg-purple-500/20 px-4 py-2 text-purple-300 transition-colors hover:bg-purple-500/30"
            >
              <PencilSquareIcon className="h-5 w-5" />
              <span>{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
            </button>

            {/* Profile Header */}
            <div className="mb-8 flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative mb-6"
              >
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar"
                      className="h-full w-full rounded-full border-4 border-gray-900 object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-800 text-4xl font-bold text-white">
                      {profile.userName}
                    </div>
                  )}
                </div>
              </motion.div>

              {isEditing ? (
                <input
                  type="text"
                  value={editData.userName}
                  onChange={e =>
                    setEditData({ ...editData, userName: e.target.value })
                  }
                  className="mb-2 border-b-2 border-purple-500 bg-transparent text-center text-3xl font-bold text-white"
                />
              ) : (
                <h1 className="mb-2 text-3xl font-bold text-white">
                  {profile.userName}
                </h1>
              )}

              <div className="flex items-center space-x-2 rounded-full bg-gray-800/50 px-4 py-1">
                <span className="text-sm text-purple-400">
                  {getRoleLabel(profile.roleID)}
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gray-800/30 p-6">
                <h3 className="mb-4 text-lg font-semibold text-purple-400">
                  Thông tin tài khoản
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={e =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="w-full border-b border-purple-500/50 bg-transparent text-white focus:outline-none"
                      />
                    ) : (
                      <p className="text-white">{profile.email}</p>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <div>
                        <label className="text-sm text-gray-400">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={editData.passwordHash}
                          onChange={e =>
                            setEditData({
                              ...editData,
                              passwordHash: e.target.value,
                            })
                          }
                          className="w-full border-b border-purple-500/50 bg-transparent text-white focus:outline-none"
                          placeholder="Để trống nếu không đổi"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">
                          Xác nhận mật khẩu
                        </label>
                        <input
                          type="password"
                          value={editData.confirmPassword}
                          onChange={e =>
                            setEditData({
                              ...editData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full border-b border-purple-500/50 bg-transparent text-white focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm text-gray-400">
                      Ngày tạo tài khoản
                    </label>
                    <p className="text-white">
                      {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-800/30 p-6">
                <h3 className="mb-4 text-lg font-semibold text-purple-400">
                  Thống kê
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Sự kiện đã tham gia</span>
                    <span className="text-white">25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Vé đang có</span>
                    <span className="text-white">12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-center space-x-4"
              >
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 rounded-full bg-purple-500 px-6 py-3 transition-colors hover:bg-purple-600"
                >
                  <CheckIcon className="h-5 w-5" />
                  <span>Lưu thay đổi</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                  className="flex items-center space-x-2 rounded-full bg-gray-700 px-6 py-3 transition-colors hover:bg-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                  <span>Hủy bỏ</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
