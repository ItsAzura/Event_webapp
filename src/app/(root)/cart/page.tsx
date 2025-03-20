'use client';

import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { useCartStore } from '@/store/cartStore';
import { createRegistration } from '@/services/registration/api';
import { createCheckoutSession } from '@/services/payment/api';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Loading from '@/components/Shared/Loading';

export default function MyTickets() {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);
  const cart = useCartStore(state => state.cart);
  const increaseQuantity = useCartStore(state => state.increaseQuantity);
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity);
  const clearCart = useCartStore(state => state.clearCart);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi lên server để đặt vé
      const registrationData = {
        userID: Number(user?.id),
        registrationDetails: cart.map(ticket => ({
          ticketID: Number(ticket.ticketID),
          quantity: ticket.quantity,
        })),
      };

      // Gọi API để tạo registration
      const response = await createRegistration(registrationData);

      if (response && response.data) {
        const registrationId = response.data.registrationID;
        const totalAmount = cart.reduce(
          (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
          0,
        );

        // Gọi API để tạo session thanh toán Stripe
        const stripeResponse = await createCheckoutSession(
          registrationId,
          totalAmount,
        );
        console.log('Stripe Response:', stripeResponse.url);

        const { sessionId, url } = stripeResponse; // Truy cập trực tiếp
        if (url) {
          console.log('Redirecting to:', url);
          window.location.href = url; // Chuyển hướng đến Stripe Checkout
        } else {
          console.error('No Stripe URL returned:', stripeResponse);
        }
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loading label="Processing your order..." color="blue" size="md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-2xl shadow-blue-100/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎟 My Tickets
            </span>
          </h2>

          <AnimatePresence>
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-12"
              >
                <div className="mb-4 text-6xl">🎫</div>
                <p className="text-gray-500">Your ticket cart is empty</p>
              </motion.div>
            ) : (
              <motion.ul className="space-y-4">
                {cart.map(ticket => (
                  <motion.li
                    key={ticket.ticketID}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="rounded-xl bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {ticket.ticketName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {Number(ticket.price).toLocaleString()} VND
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQuantity(ticket.ticketID)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                        >
                          ➖
                        </button>
                        <span className="w-8 text-center text-lg font-medium text-blue-600">
                          {ticket.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(ticket.ticketID)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 space-y-4 border-t border-gray-200 pt-6"
          >
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-600">Total Tickets:</span>
              <motion.span
                key={cart.reduce((acc, item) => acc + item.quantity, 0)}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-blue-600"
              >
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </motion.span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-600">Total Price:</span>
              <motion.span
                key={cart.reduce(
                  (acc, item) =>
                    acc + (Number(item.price) || 0) * item.quantity,
                  0,
                )}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-purple-600"
              >
                {cart
                  .reduce(
                    (acc, item) =>
                      acc + (Number(item.price) || 0) * item.quantity,
                    0,
                  )
                  .toLocaleString()}{' '}
                VND
              </motion.span>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              onClick={clearCart}
              className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Clear All
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Checkout Now'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
