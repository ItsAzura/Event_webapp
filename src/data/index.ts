import {
  CalendarIcon,
  TicketIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';

export const categories = [
  {
    name: 'Công nghệ',
    icon: SparklesIcon,
    count: '1.2k+',
    color: 'bg-blue-100',
  },
  {
    name: 'Âm nhạc',
    icon: TicketIcon,
    count: '980+',
    color: 'bg-purple-100',
  },
  {
    name: 'Nghệ thuật',
    icon: UserGroupIcon,
    count: '650+',
    color: 'bg-pink-100',
  },
  {
    name: 'Giáo dục',
    icon: CalendarIcon,
    count: '2.3k+',
    color: 'bg-orange-100',
  },
];

export const events = [
  {
    id: 1,
    title: 'Lễ hội Âm nhạc Toàn cầu',
    date: '15-17/12/2023',
    location: 'Hà Nội',
    image: '/concert.jpg',
    type: 'Bán chạy',
  },
  {
    id: 2,
    title: 'Hội nghị AI & Tương lai',
    date: '20/12/2023',
    location: 'TP.HCM',
    image: '/tech-event.jpg',
    type: 'Mới nhất',
  },
  {
    id: 3,
    title: 'Triển lãm Nghệ thuật Số',
    date: '25-30/12/2023',
    location: 'Đà Nẵng',
    image: '/digital-art.jpg',
    type: 'Premium',
  },
];
