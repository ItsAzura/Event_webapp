'use client';

import { Category } from '@/types/index';
import { getEventById } from '@/services/event/api';
import react, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { updateEvent, deleteEvent } from '@/services/event/api';
import { useRouter } from 'next/navigation';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    fetchEvent();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Image Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={`https://localhost:7198/api/event/images/${event.eventImage}`}
          alt={event.eventName}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75" />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative -mt-24 rounded-2xl bg-white p-8 shadow-xl">
          {/* Action Buttons */}
          <div className="absolute right-6 top-6 flex gap-3">
            <button
              onClick={handleEditClick}
              className="rounded-lg bg-blue-100 p-2 transition-colors hover:bg-blue-200"
            >
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="rounded-lg bg-red-100 p-2 transition-colors hover:bg-red-200"
            >
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Event Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {event.eventName}
              </h1>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{event.eventDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{event.eventLocation}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {event.eventCategories.map(ec => (
                <span
                  key={ec.category.categoryID}
                  className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
                >
                  {ec.category.categoryName}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Chi tiết sự kiện
              </h3>
              <p className="leading-relaxed text-gray-600">
                {event.eventDescription}
              </p>
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
    </div>
  );
};

export default EventDetail;
