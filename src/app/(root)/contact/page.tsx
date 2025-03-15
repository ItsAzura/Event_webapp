'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ContactSchema } from '@/schemas/contactShema';
import { createContact } from '@/services/contact/api';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { AddContactData } from '@/types/index';

export default function ContactForm() {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);
  const [form, setForm] = useState<AddContactData>({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.id === '1') {
      toast.error('Tài khoản admin không thể gửi tin nhắn!');
      return;
    }

    try {
      const result = ContactSchema.safeParse(form);
      if (!result.success) {
        return toast.error(result.error.errors[0].message);
      }

      const response = await createContact(form);

      if (response.status !== 200) {
        toast.error('Có lỗi xảy ra khi gửi tin nhắn!');
        return;
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi tin nhắn!';
      toast.error(errorMessage);
    }

    toast.success('Tin nhắn của bạn đã được gửi thành công!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl rounded-[2rem] border-4 border-purple-100 bg-gradient-to-br from-white to-purple-50 p-10 shadow-2xl shadow-purple-100"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text p-4 text-center text-6xl font-bold text-transparent"
      >
        Kết nối cùng chúng tôi
      </motion.h2>
      <p className="mb-8 text-center text-xl text-purple-800/90">
        Bạn có câu hỏi về sự kiện? Hãy liên hệ ngay - Chúng tôi luôn sẵn lòng hỗ
        trợ!
      </p>
      <div className="grid gap-12 md:grid-cols-2">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Nhập họ tên của bạn..."
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full rounded-2xl border-2 border-purple-100 bg-white p-5 text-lg text-purple-900 shadow-lg transition-all hover:border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200"
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ email của bạn..."
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-2xl border-2 border-purple-100 bg-white p-5 text-lg text-purple-900 shadow-lg transition-all hover:border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200"
            />
          </div>
          <div className="relative">
            <textarea
              name="message"
              placeholder="Nội dung tin nhắn..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full rounded-2xl border-2 border-purple-100 bg-white p-5 text-lg text-purple-900 shadow-lg transition-all hover:border-purple-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200"
            ></textarea>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-xl font-bold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-600 hover:shadow-xl"
          >
            Gửi ngay ✨
          </motion.button>
        </motion.form>

        <motion.div
          className="flex flex-col justify-center space-y-10 rounded-2xl bg-purple-600/10 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-start space-x-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600/20">
              <MapPin className="h-8 w-8 text-purple-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-purple-900">
                Địa điểm sự kiện
              </h3>
              <p className="text-lg text-purple-800/90">
                123 Đường ABC, TP. Vinh
                <br />
                Nghệ An
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600/20">
              <Phone className="h-8 w-8 text-purple-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-purple-900">
                Hotline
              </h3>
              <p className="text-lg text-purple-800/90">
                +84 123 456 789
                <br />
                Thứ 2 - CN: 8h - 22h
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600/20">
              <Mail className="h-8 w-8 text-purple-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-purple-900">
                Email hỗ trợ
              </h3>
              <p className="text-lg text-purple-800/90">
                contact@event.com
                <br />
                support@event.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
