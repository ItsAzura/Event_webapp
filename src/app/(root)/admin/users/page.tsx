'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { toast } from 'react-toastify';
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from '@/services/admin/api';

interface UserType {
  userID: number;
  userName: string;
  email: string;
  roleID: number;
}

const roleMap: { [key: number]: string } = {
  1: 'Admin',
  2: 'User',
};

export default function AdminUsersTable() {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);

  const [users, setUsers] = useState<UserType[]>([]);
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
  const [newUser, setNewUser] = useState({
    UserName: '',
    Email: '',
    PasswordHash: '',
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
      console.log('Fetched Data:', data);
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
    setNewUser({ UserName: '', Email: '', PasswordHash: '' });
    setIsAddUserModalOpen(true);
  };

  // Add user
  const handleAddUser = async () => {
    try {
      const response = await addUser(newUser);

      console.log('Add user response:', response);

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

      console.log('Delete response:', response);

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
      userName: user.userName,
      email: user.email,
      passwordHash: user.passwordHash,
      roleID: user.roleID,
    };

    try {
      const response = await updateUser(user.userID.toString(), updatedUser);

      console.log('Update user response:', response);

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
    <div className="ml-64 min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="">
            <h1 className="text-3xl font-bold text-blue-800">
              Quản lý Người dùng
            </h1>
            <p className="mt-2 text-gray-600">
              Quản lý và giám sát tài khoản người dùng hệ thống
            </p>
          </div>

          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={openAddUserModal}
          >
            Thêm người dùng
          </button>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>

          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:w-48"
            value={selectedRole ?? 'all'}
            onChange={e =>
              setSelectedRole(
                e.target.value === 'all' ? null : parseInt(e.target.value),
              )
            }
          >
            <option value="all">Tất cả vai trò</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Tên
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-800">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  {users &&
                    users.map(user => (
                      <tr
                        key={user.userID}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm ${
                              user.roleID === 1
                                ? 'bg-purple-100 text-purple-800'
                                : user.roleID === 2
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {roleMap[user.roleID]}
                          </span>
                        </td>

                        <td className="flex gap-3 px-6 py-4">
                          <button
                            className="text-blue-600 transition-colors hover:text-blue-900"
                            onClick={() => {
                              setEditingUser({ ...user, passwordHash: '' });
                              setIsEditUserModalOpen(true); // Mở popup
                            }}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 transition-colors hover:text-red-900"
                            onClick={() => openDeleteModal(user.userID)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <div className="text-sm text-gray-600">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
                  {Math.min(currentPage * itemsPerPage, totalCount)} của{' '}
                  {totalCount} kết quả
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`rounded-lg px-4 py-2 ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage(p => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

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
              value={newUser.UserName}
              onChange={e =>
                setNewUser({ ...newUser, UserName: e.target.value })
              }
            />

            {/* Nhập email */}
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border px-3 py-2 text-gray-800"
              value={newUser.Email}
              onChange={e => setNewUser({ ...newUser, Email: e.target.value })}
            />

            {/* Nhập mật khẩu */}
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 text-gray-800"
              value={newUser.PasswordHash}
              onChange={e =>
                setNewUser({ ...newUser, PasswordHash: e.target.value })
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
                setEditingUser({ ...editingUser, passwordHash: e.target.value })
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
    </div>
  );
}
