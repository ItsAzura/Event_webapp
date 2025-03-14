import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(3, 'Tên phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  message: z.string().min(10, 'Nội dung tin nhắn phải có ít nhất 10 ký tự'),
});
