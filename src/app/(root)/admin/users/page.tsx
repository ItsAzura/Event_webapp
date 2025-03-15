'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { toast } from 'react-toastify';
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from '@/services/admin/api';
import { UserSchema } from '@/schemas/userSchema';
import { AddUserData, User } from '@/types/index';

const roleMap: { [key: number]: string } = {
  1: 'Admin',
  2: 'User',
};

export default function AdminUsersTable() {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<AddUserData>({
    userName: '',
    email: '',
    passwordHash: '',
  });

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    userID: number | null;
    userName: string;
    email: string;
    roleID: number;
    passwordHash: string;
  }>({
    userID: null,
    userName: '',
    email: '',
    roleID: 0,
    passwordHash: '',
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: itemsPerPage.toString(),
      });
      if (selectedRole !== null) {
        params.append('RoleId', selectedRole.toString());
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await getAllUsers(params.toString());
      if (response.status !== 200) {
        throw new Error('Failed to fetch users');
      }

      const data = response.data;
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 0);
      setTotalCount(data.totalCount || 0);
    } catch (error: unknown) {
      console.error('Failed to fetch users', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while fetching users',
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedRole, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openAddUserModal = () => {
    setNewUser({ userName: '', email: '', passwordHash: '' });
    setIsAddUserModalOpen(true);
  };

  // Add user
  const handleAddUser = async () => {
    try {
      const result = UserSchema.safeParse(newUser);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }

      const response = await addUser(newUser);

      if (response.status !== 201) {
        toast.error('Thêm người dùng thất bại');
        return console.error('Failed to add user');
      }

      toast.success('Thêm người dùng thành công');
      fetchUsers(); // Cập nhật danh sách user
      setIsAddUserModalOpen(false); // Đóng popup
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    }
  };

  const openDeleteModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Delete user
  const handleDeleteConfirmed = async () => {
    if (!selectedUserId) return;

    if (user?.id === selectedUserId.toString()) {
      toast.error('Không thể xóa chính mình');
      return;
    }

    if (selectedUserId === 1) {
      toast.error('Không thể xóa người dùng Admin');
      return;
    }

    try {
      const response = await deleteUser(selectedUserId.toString());

      if (response.status !== 200) {
        toast.error('Xóa người dùng thất bại');
        return console.error('Failed to delete user');
      }

      fetchUsers(); // Cập nhật lại danh sách người dùng
      setIsModalOpen(false); // Đóng popup sau khi xóa thành công
      toast.success('Xóa người dùng thành công');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    }
  };

  const handleUpdateUser = async (user: {
    userID: number;
    userName?: string;
    email?: string;
    roleID?: number;
    passwordHash?: string;
  }) => {
    if (user.userID === 1) {
      toast.error('Không thể cập nhật người dùng Admin');
      return;
    }

    // Chỉ lấy các field cần gửi lên API
    const updatedUser = {
      userName: user.userName || null,
      email: user.email || null,
      passwordHash: user.passwordHash || null,
      roleID: user.roleID || null,
    };

    try {
      const response = await updateUser(user.userID.toString(), updatedUser);

      if (response.status !== 200) {
        toast.error('Cập nhật người dùng thất bại');
        return console.error('Failed to update user');
      }

      toast.success('Cập nhật người dùng thành công');
      fetchUsers(); // Cập nhật danh sách user
      setIsEditUserModalOpen(false); // Đóng popup
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-3xl font-bold text-white"
            >
              Quản lý{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Người dùng
              </span>
            </motion.h1>
            <p className="mt-2 text-gray-400">
              Quản lý và giám sát tài khoản người dùng hệ thống
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-all hover:shadow-blue-500/30"
            onClick={openAddUserModal}
          >
            Thêm người dùng
          </motion.button>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-12 py-3 text-white backdrop-blur-lg transition-all placeholder:text-gray-400 focus:border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur-lg transition-all focus:border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:w-48"
            value={selectedRole ?? 'all'}
            onChange={e =>
              setSelectedRole(
                e.target.value === 'all' ? null : parseInt(e.target.value),
              )
            }
          >
            <option value="all" className="text-gray-800">
              Tất cả vai trò
            </option>
            <option value="1" className="text-gray-800">
              Admin
            </option>
            <option value="2" className="text-gray-800">
              User
            </option>
          </select>
        </motion.div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900/30 backdrop-blur-lg">
          {loading ? (
            // Skeleton Loading
            <div className="space-y-4 p-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-gray-800/50"
                />
              ))}
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="border-b border-white/10 bg-gray-800/20">
                  <tr>
                    {['Tên', 'Email', 'Vai trò', 'Hành động'].map(
                      (header, i) => (
                        <th
                          key={i}
                          className="px-6 py-4 text-left text-sm font-semibold text-purple-400"
                        >
                          {header}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <AnimatePresence>
                    {users.map(user => (
                      <motion.tr
                        key={user.userID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="transition-colors hover:bg-gray-800/20"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <motion.span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              user.roleID === 1
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {roleMap[user.roleID]}
                          </motion.span>
                        </td>
                        <td className="flex gap-3 px-6 py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-purple-400 transition-colors hover:text-purple-300"
                            onClick={() => {
                              setEditingUser({ ...user, passwordHash: '' });
                              setIsEditUserModalOpen(true);
                            }}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-400 transition-colors hover:text-red-300"
                            onClick={() => openDeleteModal(user.userID)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Pagination */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-white/10 px-6 py-4"
              >
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <span className="text-sm text-gray-400">
                    Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, totalCount)} của{' '}
                    {totalCount} kết quả
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-lg transition-all hover:bg-white/10 disabled:opacity-50"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </motion.button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className={`rounded-xl px-4 py-2 text-sm ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur-lg transition-all hover:bg-white/10 disabled:opacity-50"
                      onClick={() =>
                        setCurrentPage(p => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-96 rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-lg"
            >
              <h2 className="text-xl font-semibold text-white">
                Xác nhận xóa người dùng?
              </h2>
              <p className="mt-2 text-gray-400">
                Bạn có chắc chắn muốn xóa người dùng này không?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-lg transition-all hover:bg-white/10"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-white shadow-lg transition-all hover:shadow-red-500/30"
                  onClick={handleDeleteConfirmed}
                >
                  Xóa
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Xác nhận xóa người dùng?
              </h2>
              <p className="mt-2 text-gray-600">
                Bạn có chắc chắn muốn xóa người dùng này không?
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  onClick={handleDeleteConfirmed}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddUserModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Thêm Người Dùng
              </h2>

              {/* Nhập tên */}
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Tên
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-gray-800"
                value={newUser.userName}
                onChange={e =>
                  setNewUser({ ...newUser, userName: e.target.value })
                }
              />

              {/* Nhập email */}
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2 text-gray-800"
                value={newUser.email}
                onChange={e =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />

              {/* Nhập mật khẩu */}
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-gray-800"
                value={newUser.passwordHash}
                onChange={e =>
                  setNewUser({ ...newUser, passwordHash: e.target.value })
                }
              />

              {/* Nút hành động */}
              <div className="mt-4 flex justify-end gap-3">
                <button
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  onClick={handleAddUser}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditUserModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                Chỉnh sửa Người Dùng
              </h2>

              {/* Nhập tên */}
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Tên
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-gray-800"
                value={editingUser.userName}
                onChange={e =>
                  setEditingUser({ ...editingUser, userName: e.target.value })
                }
              />

              {/* Nhập email */}
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border px-3 py-2 text-gray-800"
                value={editingUser.email}
                onChange={e =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />

              {/* Nhập vai trò */}
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="number"
                className="w-full rounded-md border px-3 py-2 text-gray-800"
                value={editingUser.roleID}
                onChange={e =>
                  setEditingUser({
                    ...editingUser,
                    roleID: Number(e.target.value),
                  })
                }
              />

              {/* Nhập mật khẩu mới */}
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-gray-800"
                value={editingUser.passwordHash}
                onChange={e =>
                  setEditingUser({
                    ...editingUser,
                    passwordHash: e.target.value,
                  })
                }
              />

              {/* Nút hành động */}
              <div className="mt-4 flex justify-end gap-3">
                <button
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  onClick={() => setIsEditUserModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={() => {
                    if (editingUser.userID !== null) {
                      handleUpdateUser({
                        ...editingUser,
                        userID: editingUser.userID,
                      });
                    }
                  }}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
