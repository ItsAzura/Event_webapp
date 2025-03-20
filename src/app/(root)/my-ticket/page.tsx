'use client';

import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { useCartStore } from '@/store/cartStore';
import { createRegistration } from '@/services/registration/api';
import { createCheckoutSession } from '@/services/payment/api';
import { useState } from 'react';

export default function MyTickets() {
  const { accessToken, logout } = useAuthStore();
  const user = decodeAccessToken(accessToken);
  const cart = useCartStore(state => state.cart);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">🎟️ My Tickets</h2>

        {cart.length === 0 ? (
          <p className="text-gray-800">You have not booked any tickets yet.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {cart.map(ticket => (
              <li key={ticket.ticketID} className="flex justify-between py-3">
                <span className="text-lg font-medium text-gray-800">
                  Ticket: {ticket.ticketName}
                </span>
                <span className="font-semibold text-blue-600">
                  x{ticket.quantity}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-between">
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Total Tickets: {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </p>
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Total Price:{' '}
            {cart.reduce(
              (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
              0,
            )}{' '}
            VND
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white"
            onClick={clearCart}
          >
            Clear All Tickets
          </button>
          <button
            className="ml-4 mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
