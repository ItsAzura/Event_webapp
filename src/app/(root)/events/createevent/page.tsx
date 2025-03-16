'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import CreateEventForm from '@/components/ui/CreateEventForm';

const CreateEvents = () => {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);
  return (
    <div className="min-h-screen">
      <CreateEventForm userId={user?.id.toString() || ''} />
    </div>
  );
};

export default CreateEvents;
