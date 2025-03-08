import {
  CalendarIcon,
  TicketIcon,
  SparklesIcon,
  UserGroupIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/solid';

export const randomIcon = () => {
  const icons = [
    CalendarIcon,
    TicketIcon,
    SparklesIcon,
    UserGroupIcon,
    MusicalNoteIcon,
  ];
  return icons[Math.floor(Math.random() * icons.length)];
};
