import { DecodedToken } from './../types/index';
import { jwtDecode } from 'jwt-decode';

export const decodeAccessToken = (
  token: string | null,
): DecodedToken | null => {
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Decode access token error:', error);
    return null;
  }
};
