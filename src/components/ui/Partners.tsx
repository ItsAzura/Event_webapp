import Image from 'next/image';

const Partners = () => {
  const partners = [
    '/logos/partner1.svg',
    '/logos/partner2.svg',
    '/logos/partner3.svg',
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-xl text-gray-500">
          Đối tác của chúng tôi
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-75 transition-opacity hover:opacity-100">
          {partners.map((logo, index) => (
            <Image
              key={index}
              src={logo}
              alt={`Partner ${index + 1}`}
              width={160}
              height={80}
              className="h-12 object-contain grayscale transition-all hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
