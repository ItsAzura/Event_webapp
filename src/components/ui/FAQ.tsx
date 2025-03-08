import { ChevronDownIcon } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: 'Làm cách nào để đăng ký tham dự?',
      answer: 'Bạn có thể đăng ký trực tiếp trên website...',
    },
    {
      question: 'Tôi có cần phải trả phí để tham dự sự kiện không?',
      answer: 'Không, sự kiện của chúng tôi là miễn phí...',
    },
    {
      question: 'Làm cách nào để đăng ký tham dự?',
      answer: 'Bạn có thể đăng ký trực tiếp trên website...',
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">
          Câu hỏi Thường gặp
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden rounded-xl border">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between bg-gray-50 p-6 hover:bg-gray-100">
                  <h3 className="font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon className="h-5 w-5 transform text-gray-600 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-6 pt-0">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
