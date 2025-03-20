import { create } from 'zustand';
import { CartItem, CartState } from '@/types/index';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      cart: [],
      addToCart: (
        ticketName: string,
        ticketID: string,
        quantity: number,
        price: number,
      ) =>
        set(state => {
          const existingItem = state.cart.find(
            item => item.ticketID === ticketID,
          );
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.ticketID === ticketID
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { ticketName, ticketID, quantity, price: price || 0 },
            ],
          };
        }),

      updateQuantity: (ticketID, quantity) =>
        set(state => ({
          cart: state.cart.map(item =>
            item.ticketID === ticketID ? { ...item, quantity } : item,
          ),
        })),

      removeFromCart: ticketID =>
        set(state => ({
          cart: state.cart.filter(item => item.ticketID !== ticketID),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage', // Key lưu vào localStorage
    },
  ),
);
