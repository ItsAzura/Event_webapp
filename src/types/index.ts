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
