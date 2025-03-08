const Newsletter = () => (
  <section className="bg-gray-100 py-20">
    <div className="mx-auto max-w-xl px-4 text-center">
      <h3 className="mb-4 text-2xl font-bold text-gray-800">
        Nhận thông báo sự kiện mới nhất
      </h3>
      <p className="mb-6 text-gray-600">
        Đăng ký để không bỏ lỡ bất kỳ sự kiện thú vị nào
      </p>
      <form className="flex flex-col justify-center gap-4 sm:flex-row">
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="w-full rounded-lg border-2 border-gray-300 px-6 py-3 focus:border-blue-500 focus:outline-none sm:w-80"
        />
        <button className="whitespace-nowrap rounded-lg bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700">
          Đăng ký ngay
        </button>
      </form>
    </div>
  </section>
);

export default Newsletter;
