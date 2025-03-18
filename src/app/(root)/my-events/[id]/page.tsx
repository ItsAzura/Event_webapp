'use client';

import { Category, EventArea } from '@/types/index';
import { getEventById } from '@/services/event/api';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { updateEvent, deleteEvent } from '@/services/event/api';
import { useRouter } from 'next/navigation';
import {
  getEventAreasByEventId,
  createEventArea,
} from '@/services/eventarea/api';
import { formatDate } from '@/utils/dateFormat';
import Link from 'next/link';

interface Event {
  eventID: number;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  eventCategories: {
    category: Category;
  }[];
}

const EventDetail = () => {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [event, setEvent] = useState<Event>({
    eventID: 0,
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventLocation: '',
    eventImage: '',
    eventCategories: [],
  });
  const [eventAreas, setEventAreas] = useState<EventArea[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isCreateAreaModalOpen, setIsCreateAreaModalOpen] = useState(false);
  const [newAreaData, setNewAreaData] = useState({
    eventID: Number(id),
    areaName: '',
    capacity: 0,
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(Number(id));
        if (response.status !== 200) {
          toast.error('Lỗi khi lấy dữ liệu sự kiện');
          return;
        }

        // Cập nhật cả event và formData
        setEvent(response.data);
        setFormData({
          ...response.data,
          eventDate: formatISOForDateTimeLocal(response.data.eventDate),
        });

        // Khởi tạo image preview
        setImagePreview(
          `https://localhost:7198/api/event/images/${response.data.eventImage}`,
        );
      } catch (error) {
        console.error('Fetch event error', error);
      }
    };

    const fetchEventAreas = async () => {
      try {
        const response = await getEventAreasByEventId(Number(id));
        if (response.status !== 200) {
          toast.error('Lỗi khi lấy dữ liệu khu vực sự kiện');
          return;
        }

        setEventAreas(response.data);
      } catch (error) {
        console.error('Fetch event areas error', error);
      }
    };

    fetchEvent();
    fetchEventAreas();
  }, [id]);

  const formatISOForDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setFormData({
      ...event,
      eventDate: formatISOForDateTimeLocal(event.eventDate),
    });
    setImagePreview(
      `https://localhost:7198/api/event/images/${event.eventImage}`,
    );
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();

    // Chỉ thêm field khi có giá trị
    if (selectedImage) formPayload.append('EventImageFile', selectedImage);
    if (formData.eventName) formPayload.append('EventName', formData.eventName);
    if (formData.eventDescription)
      formPayload.append('EventDescription', formData.eventDescription);
    if (formData.eventDate) {
      formPayload.append(
        'EventDate',
        new Date(formData.eventDate).toISOString(),
      );
    }
    if (formData.eventLocation)
      formPayload.append('EventLocation', formData.eventLocation);

    try {
      const response = await updateEvent(event.eventID, formPayload);
      console.log('Update response:', response);

      if (response.status !== 200) {
        toast.error('Cập nhật thất bại');
        return;
      }

      toast.success('Cập nhật sự kiện thành công');

      // Lấy dữ liệu mới nhất từ server
      const updatedEvent = await getEventById(event.eventID);
      if (updatedEvent?.data) {
        setEvent(prev => ({
          ...prev,
          ...updatedEvent.data,
          eventImage: selectedImage
            ? URL.createObjectURL(selectedImage) // Nếu có ảnh mới, cập nhật preview
            : updatedEvent.data.eventImage, // Nếu không, giữ nguyên ảnh cũ
        }));

        setImagePreview(
          `https://localhost:7198/api/event/images/${updatedEvent.data.eventImage}`,
        );
      }

      // Đóng modal sau khi mọi thứ đã hoàn tất
      handleCloseModal();
    } catch (error) {
      toast.error('Cập nhật thất bại');
      console.error('Update error:', error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteEvent(event.eventID);

      if (response.status === 200) {
        toast.success('Xóa sự kiện thành công');
        router.push('/my-events'); // Chuyển hướng về trang danh sách
      } else {
        toast.error('Xóa sự kiện thất bại');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Lỗi khi xóa sự kiện');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleCreateArea = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await createEventArea({
        eventID: newAreaData.eventID,
        areaName: newAreaData.areaName,
        capacity: newAreaData.capacity,
      });

      console.log('Create area response:', response);

      if (response.status === 201) {
        toast.success('Tạo khu vực thành công');
        // Refresh data
        const updatedAreas = await getEventAreasByEventId(Number(id));
        setEventAreas(updatedAreas.data);
        setIsCreateAreaModalOpen(false);
        setNewAreaData({
          eventID: Number(id),
          areaName: '',
          capacity: 0,
        });
      }
    } catch (error) {
      toast.error('Tạo khu vực thất bại');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Event Banner */}
        <div className="relative h-[500px] overflow-hidden rounded-b-3xl shadow-lg">
          <img
            src={`https://localhost:7198/api/event/images/${event.eventImage}`}
            alt={event.eventName}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="relative -mt-28 rounded-3xl bg-white/80 p-10 shadow-xl backdrop-blur-lg">
            {/* Action Buttons */}
            <div className="absolute right-6 top-6 flex gap-3">
              <button
                onClick={handleEditClick}
                className="rounded-lg bg-blue-600 p-2 text-white shadow-md transition-all hover:scale-105 hover:bg-blue-700"
              >
                ✎
              </button>
              <button
                onClick={handleDeleteClick}
                className="rounded-lg bg-red-600 p-2 text-white shadow-md transition-all hover:scale-105 hover:bg-red-700"
              >
                🗑
              </button>
            </div>

            {/* Event Info */}
            <div className="space-y-8">
              <h1 className="text-5xl font-bold text-gray-900">
                {event.eventName}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-700">
                <div className="flex items-center gap-2 text-lg">
                  ⏳ <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  📍 <span>{event.eventLocation}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {event.eventCategories.map(ec => (
                  <span
                    key={ec.category.categoryID}
                    className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm"
                  >
                    {ec.category.categoryName}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="prose max-w-none text-gray-800">
                <h3 className="mb-4 text-2xl font-semibold">
                  Chi tiết sự kiện
                </h3>
                <p className="leading-relaxed">{event.eventDescription}</p>
              </div>
            </div>
          </div>

          {/* Event Areas */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">
                Các khu vực
              </h3>
              <button
                onClick={() => setIsCreateAreaModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-md transition-all hover:scale-105 hover:bg-green-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Thêm khu vực
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventAreas.map(area => (
                <div
                  key={area.eventAreaID}
                  className="flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-md transition-all hover:shadow-xl"
                >
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {area.areaName}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Sức chứa: {area.capacity} người
                    </p>
                  </div>
                  <Link href={`/my-events/event-area/${area.eventAreaID}`}>
                    <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700">
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              ))}
              {!eventAreas.length && (
                <div className="col-span-full py-6 text-center text-gray-500">
                  Chưa có khu vực nào được thiết lập
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl space-y-6 rounded-2xl bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Chỉnh sửa sự kiện
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên sự kiện
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border p-2 text-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày sự kiện
                  </label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={
                      formData.eventDate
                        ? formatISOForDateTimeLocal(formData.eventDate)
                        : ''
                    }
                    onChange={handleInputChange}
                    className="w-full rounded-lg border p-2 text-gray-800"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation || ''}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border p-2 text-gray-800"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    name="eventDescription"
                    value={formData.eventDescription || ''}
                    onChange={handleInputChange}
                    className="h-32 w-full rounded-lg border p-2 text-gray-800"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ảnh bìa
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-lg border p-2 text-gray-800"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 h-32 rounded-lg object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa sự kiện "{event.eventName}"?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Area Modal */}
      {isCreateAreaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Tạo khu vực mới
            </h2>

            <form onSubmit={handleCreateArea} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên khu vực
                </label>
                <input
                  type="text"
                  required
                  value={newAreaData.areaName}
                  onChange={e =>
                    setNewAreaData(prev => ({
                      ...prev,
                      areaName: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sức chứa
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newAreaData.capacity || ''}
                  onChange={e =>
                    setNewAreaData(prev => ({
                      ...prev,
                      capacity: Number(e.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateAreaModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
                  disabled={isCreating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isCreating}
                >
                  {isCreating && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  Tạo khu vực
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
