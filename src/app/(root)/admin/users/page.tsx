'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

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
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

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

      const response = await fetch(
        `https://localhost:7198/api/user?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched Data:', data);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 0);
      setTotalCount(data.totalCount || 0);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedRole, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await fetch(
          `https://localhost:7198/api/user/${userId}`,
          {
            method: 'DELETE',
          },
        );

        if (!response.ok) throw new Error('Xóa không thành công');
        fetchUsers();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      }
    }
  };

  console.log(users);

  return (
    <div className="ml-64 min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Quản lý Người dùng
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý và giám sát tài khoản người dùng hệ thống
          </p>
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
            <option value="2">Organizer</option>
            <option value="3">User</option>
          </select>
        </div>

        {/* Error & Loading */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

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
                            onClick={() => console.log('Edit', user.userID)}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 transition-colors hover:text-red-900"
                            onClick={() => handleDelete(user.userID)}
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
    </div>
  );
}
