'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const registrationId = searchParams.get('registrationId');
  const router = useRouter();
  const clearCart = useCartStore(state => state.clearCart);

  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    if (sessionId && registrationId) {
      setMessage('Payment successful! Your registration is confirmed.');
    } else {
      setMessage('Invalid payment session.');
    }
  }, [sessionId, registrationId]);

  useEffect(() => {
    const registrationId = searchParams.get('registrationId');
    if (registrationId) {
      console.log('Payment successful for Registration ID:', registrationId);
      clearCart();
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-green-600">
          🎉 Payment Successful!
        </h2>
        <p className="mt-2 text-gray-800">Thank you for your purchase.</p>
        <button
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
          onClick={() => router.push('/')}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
