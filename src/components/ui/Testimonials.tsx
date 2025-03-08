import { StarIcon } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: 'Trải nghiệm tuyệt vời với nhiều kiến thức hữu ích!',
      author: 'Trần Thị B',
      role: 'Người tham dự',
    },
    {
      id: 2,
      text: 'Sự kiện rất chất lượng, tôi đã học được rất nhiều điều mới!',
      author: 'Nguyễn Văn A',
      role: 'Người tham dự',
    },
    {
      id: 3,
      text: 'Rất ấn tượng với chất lượng của sự kiện!',
      author: 'Phạm Văn C',
      role: 'Người tham dự',
    },
    {
      id: 4,
      text: 'Tôi rất hài lòng với sự kiện!',
      author: 'Nguyen Van D',
      role: 'Người tham dự',
    },
  ];

  return (
    <section className="bg-indigo-50 py-20">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          Phản hồi Từ Người Tham Gia
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="rounded-xl bg-white p-8 shadow-md"
            >
              <div className="mb-4 flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {testimonial.author[0]}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic text-gray-700">"{testimonial.text}"</p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
