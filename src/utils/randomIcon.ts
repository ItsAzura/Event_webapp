import {
  CalendarIcon,
  TicketIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';

export const randomIcon = () => {
  const icons = [CalendarIcon, TicketIcon, SparklesIcon, UserGroupIcon];
  return icons[Math.floor(Math.random() * icons.length)];
};
