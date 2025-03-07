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
  email: string;
  exp: number; // Thời gian hết hạn của token
}

export interface AuthContextType {
  accessToken: string | null;
}
