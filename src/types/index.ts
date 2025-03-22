import { create } from 'zustand';
import { JSX } from 'react';

//Type for Register
export type RegisterData = {
  userName: string;
  email: string;
  passwordHash: string;
};

//Type for Login
export type LoginData = {
  email: string;
  passwordHash: string;
};

export interface DecodedToken {
  avatarUrl: string | undefined;
  id: string;
  userName: string;
  role: string;
  email: string;
  exp: number;
}

export interface AuthContextType {
  accessToken: string | null;
}

export interface Event {
  eventID: number;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  createdBy: number;
  eventStatus: string;
}

export interface Category {
  categoryID: number;
  categoryName: string;
  categoryImage: string;
}

export interface ApiResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  events: Event[];
}
export interface EventArea {
  eventAreaID: number;
  areaName: string;
  capacity: number;
  price?: number;
}

export interface Ticket {
  ticketID: number;
  eventAreaID: number;
  ticketName: string;
  description: string;
  quantity: number;
  price: number;
  status: string;
  eventArea: null;
}

export interface RegistrationDetail {
  registrationDetailID: number;
  quantity: number;
  ticket: Ticket;
}

export interface Registration {
  registrationID: number;
  registrationDate: string;
  paymentDate: string;
  registrationDetails: RegistrationDetail[];
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isResponded: boolean;
}

export interface ContactResponse {
  id: number;
  responseMessage: string;
  adminEmail: string;
}

export interface User {
  userID: number;
  userName: string;
  email: string;
  roleID: number;
}

export type AddUserData = {
  userName: string;
  email: string;
  passwordHash: string;
};

export type UpdateUserData = {
  userName: string | null;
  email: string | null;
  passwordHash: string | null;
  roleID: number | null;
};

export interface AddContactData {
  name: string;
  email: string;
  message: string;
}

export interface ResponseContactData {
  id: number;
  responseMessage: string;
  adminEmail: string;
}

export type EventFormData = {
  EventName: string;
  EventDescription: string;
  EventDate: string;
  EventLocation: string;
  EventImageFile: FileList;
};

export interface CartItem {
  ticketName: string;
  ticketID: string;
  quantity: number;
  price: number;
}

export interface CartState {
  cart: CartItem[];
  addToCart: (
    ticketName: string,
    ticketID: string,
    quantity: number,
    price: number,
  ) => void;
  updateQuantity: (ticketID: string, quantity: number) => void;
  removeFromCart: (ticketID: string) => void;
  increaseQuantity: (ticketID: string) => void;
  decreaseQuantity: (ticketID: string) => void;
  clearCart: () => void;
}

export type Profile = {
  userID: number;
  userName: string;
  avatarUrl: string | null;
  PasswordHash: string | null;
  email: string;
  roleID: number;
  createdAt: string;
};

export interface feedBack {
  id: number;
  eventId: number;
  comment: string;
  rating: number;
  createdAt: string;
  userId: number;
}
