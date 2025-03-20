import api from '@/services/api';

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const createCheckoutSession = async (
  registrationId: number,
  amount: number,
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await api.post<CheckoutSessionResponse>(
      '/payment/create-checkout-session',
      {
        registrationId,
        amount,
      },
    );
    return response.data; // Không bọc thêm trong { data: CheckoutSessionResponse }
  } catch (error) {
    console.error('Create checkout session error', error);
    throw error;
  }
};
