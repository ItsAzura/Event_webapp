// components/CreateEventForm.tsx
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { createEvent } from '@/services/event/api';
import { toast } from 'react-toastify';

type EventFormData = {
  EventName: string;
  EventDescription: string;
  EventDate: string;
  EventLocation: string;
  EventImageFile: FileList;
};

export default function CreateEventForm({ userId }: { userId: string }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<EventFormData> = async data => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append('EventName', data.EventName);
      formData.append('EventDescription', data.EventDescription);
      formData.append('EventDate', new Date(data.EventDate).toISOString());
      formData.append('EventLocation', data.EventLocation);
      formData.append('EventImageFile', data.EventImageFile[0]); // Kiểm tra file
      formData.append('CreatedBy', userId);

      // Debug FormData
      const entries = Array.from(formData.entries());
      entries.forEach(pair => {
        console.log(pair[0], pair[1]);
      });

      const response = await createEvent(formData);

      if (response.status !== 201) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to create event');
      }

      toast.success('Tạo sự kiện thành công!');
      setPreviewImage(null);
      setTimeout(() => {
        window.history.back();
      }, 3000);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-center text-3xl font-bold text-gray-900 text-transparent">
          Create New Event
        </h1>

        {formError && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Event Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              {...register('EventName', { required: 'Event name is required' })}
              className={`w-full rounded-lg border px-4 py-3 text-gray-800 ${
                errors.EventName ? 'border-red-500' : 'border-gray-300'
              } focus:border-transparent focus:ring-2 focus:ring-purple-500`}
            />
            {errors.EventName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.EventName.message}
              </p>
            )}
          </div>

          {/* Event Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('EventDescription', {
                required: 'Description is required',
              })}
              rows={4}
              className={`w-full rounded-lg border px-4 py-3 text-gray-800 ${
                errors.EventDescription ? 'border-red-500' : 'border-gray-300'
              } focus:border-transparent focus:ring-2 focus:ring-purple-500`}
            />
            {errors.EventDescription && (
              <p className="mt-2 text-sm text-red-600">
                {errors.EventDescription.message}
              </p>
            )}
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Event Date & Time
              </label>
              <input
                type="datetime-local"
                {...register('EventDate', {
                  required: 'Event date is required',
                })}
                className={`w-full rounded-lg border px-4 py-3 text-gray-800 ${
                  errors.EventDate ? 'border-red-500' : 'border-gray-300'
                } focus:border-transparent focus:ring-2 focus:ring-purple-500`}
              />
              {errors.EventDate && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.EventDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                {...register('EventLocation', {
                  required: 'Location is required',
                })}
                className={`w-full rounded-lg border px-4 py-3 text-gray-800 ${
                  errors.EventLocation ? 'border-red-500' : 'border-gray-300'
                } focus:border-transparent focus:ring-2 focus:ring-purple-500`}
              />
              {errors.EventLocation && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.EventLocation.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Event Image
            </label>
            <div className="mt-1 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 transition-colors hover:border-purple-500">
              <div className="space-y-1 text-center">
                {previewImage ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={previewImage}
                      alt="Event preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-medium text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:text-purple-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          {...register('EventImageFile', {
                            required: 'Event image is required',
                            onChange: handleImageChange,
                          })}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>
            {errors.EventImageFile && (
              <p className="mt-2 text-sm text-red-600">
                {errors.EventImageFile.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition-all hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
