'use client';
import Image from 'next/image';

// components/ui/FeaturedSpeakers.jsx
const FeaturedSpeakers = () => {
  const speakers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'CEO TechMaster',
      image: '/images/speaker1.jpg',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Founder TechMaster',
      image: '/images/speaker2.jpg',
    },
    {
      id: 3,
      name: 'Phạm Văn C',
      role: 'CTO TechMaster',
      image: '/images/speaker3.jpg',
    },
  ];

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          Diễn giả Nổi bật
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {speakers.map(speaker => (
            <div
              key={speaker.id}
              className="group relative rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden rounded-t-xl">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {speaker.name}
                </h3>
                <p className="mt-2 text-gray-600">{speaker.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpeakers;
