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

export const eventTimeLine = [
  {
    date: '2024-10-15',
    title: 'Lễ hội Âm nhạc Mùa Thu',
    location: 'Hà Nội',
    time: '18:00 - 23:00',
    description:
      'Lễ hội âm nhạc sôi động với sự tham gia của nhiều nghệ sĩ hàng đầu.',
  },
  {
    date: '2024-10-20',
    title: 'Đêm nhạc EDM Festival',
    location: 'TP.HCM',
    time: '19:00 - 02:00',
    description:
      'Sự kiện EDM hoành tráng với DJ quốc tế và dàn âm thanh ánh sáng cực chất.',
  },
  {
    date: '2024-10-25',
    title: 'Rock Show - Huyền thoại trở lại',
    location: 'Đà Nẵng',
    time: '17:30 - 22:30',
    description: 'Đêm nhạc Rock cháy hết mình cùng các ban nhạc huyền thoại.',
  },
  {
    date: '2024-10-30',
    title: 'Acoustic Night - Giai điệu yêu thương',
    location: 'Hải Phòng',
    time: '20:00 - 23:00',
    description:
      'Đêm nhạc nhẹ nhàng với những ca khúc Acoustic sâu lắng, đầy cảm xúc.',
  },
];
