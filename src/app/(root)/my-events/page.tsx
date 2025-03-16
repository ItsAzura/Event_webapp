import React from 'react';
import { getAllCategories } from '@/services/category/api';
import { getEventByUserId } from '@/services/event/api';
import EventsClient from '@/components/ui/EventsClient';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { cookies } from 'next/headers';

const MyEventPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const accessToken = cookies().get('accessToken')?.value; // Lấy token từ cookies
  const user = accessToken ? decodeAccessToken(accessToken) : null;

  if (!user?.id) {
    return <p>User not authenticated</p>;
  }

  const page = parseInt(searchParams.page || '1');
  const pageSize = parseInt(searchParams.pageSize || '10');
  const categoryId = searchParams.categoryId
    ? parseInt(searchParams.categoryId)
    : undefined;
  const search = searchParams.search || undefined;

  const [eventsData, categories] = await Promise.all([
    getEventByUserId(user.id, page, pageSize, categoryId, search),
    getAllCategories(),
  ]);

  return (
    <EventsClient
      name={'Khu Vực Sự Kiện Của Bạn'}
      eventAreaUrl="my-events/event-area"
      eventsData={eventsData}
      categories={categories}
      searchParams={searchParams}
    />
  );
};

export default MyEventPage;
