// store/eventStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { Event } from '@/types/index';

export interface EventDto {
  eventName: string;
  eventDescription: string;
  eventDate: Date;
  eventLocation: string;
  createdBy: number;
  eventImageFile?: File;
}

interface EventState {
  events: Event[];
  topEvents: Event[];
  loading: boolean;
  fetchEvents: (
    page?: number,
    pageSize?: number,
    categoryId?: number,
    search?: string,
  ) => Promise<void>;
  fetchTopEvents: () => Promise<void>;
  getEventById: (id: number) => Promise<Event | null>;
  updateEvent: (id: number, eventData: EventDto) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
}

export const useEventStore = create<EventState>(set => ({
  events: [],
  topEvents: [],
  loading: false,

  fetchEvents: async (page = 1, pageSize = 10, categoryId, search) => {
    set({ loading: true });
    try {
      const response = await axios.get('https://localhost:7198/api/event', {
        params: { page, pageSize, categoryId, search },
      });
      const data = response.data as { Events: Event[] };
      set({ events: data.Events, loading: false });
    } catch (error) {
      console.error('Error fetching events', error);
      set({ loading: false });
    }
  },

  fetchTopEvents: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('https://localhost:7198/top6');
      set({ topEvents: response.data as Event[], loading: false });
    } catch (error) {
      console.error('Error fetching top events', error);
      set({ loading: false });
    }
  },

  getEventById: async (id: number): Promise<Event | null> => {
    try {
      const response = await axios.get(
        `https://localhost:7198/api/event/${id}`,
      );
      return response.data as Event;
    } catch (error) {
      console.error(`Error fetching event ${id}`, error);
      return null;
    }
  },

  updateEvent: async (id: number, eventData: EventDto) => {
    const formData = new FormData();
    formData.append('EventName', eventData.eventName);
    formData.append('EventDescription', eventData.eventDescription);
    formData.append('EventDate', eventData.eventDate.toISOString());
    formData.append('EventLocation', eventData.eventLocation);
    formData.append('CreatedBy', eventData.createdBy.toString());
    if (eventData.eventImageFile) {
      formData.append('EventImageFile', eventData.eventImageFile);
    }

    try {
      await axios.put(`https://localhost:7198/api/event/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Nếu cần token: Authorization: `Bearer ${token}`,
        },
      });
      // Sau khi update thành công có thể cập nhật lại store hoặc hiển thị thông báo
    } catch (error) {
      console.error('Error updating event:', error);
    }
  },

  deleteEvent: async (id: number) => {
    try {
      await axios.delete(`https://localhost:7198/api/event/${id}`, {
        headers: {
          // Nếu cần token: Authorization: `Bearer ${token}`,
        },
      });
      // Sau khi xóa thành công có thể cập nhật lại store hoặc chuyển hướng người dùng
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  },
}));
