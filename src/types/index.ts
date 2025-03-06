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
