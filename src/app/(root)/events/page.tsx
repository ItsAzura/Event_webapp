// app/events/page.tsx (Server Component - Không cần 'use client')

import { Event, Category, ApiResponse } from '@/types/index';
import { getAllCategories } from '@/services/category/api';
import { getEvents } from '@/services/event/api';
import EventsClient from '@/components/ui/EventsClient';

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const fetchEvents = async (): Promise<ApiResponse> => {
    const page = parseInt(searchParams.page || '1');
    const pageSize = parseInt(searchParams.pageSize || '10');
    const categoryId = searchParams.categoryId
      ? parseInt(searchParams.categoryId)
      : undefined;
    const search = searchParams.search || undefined;

    return getEvents(page, pageSize, categoryId, search);
  };

  const fetchCategories = async (): Promise<Category[]> => {
    return getAllCategories();
  };

  const [eventsData, categories] = await Promise.all([
    fetchEvents(),
    fetchCategories(),
  ]);

  return (
    <EventsClient
      eventsData={eventsData}
      categories={categories}
      searchParams={searchParams}
    />
  );
}
