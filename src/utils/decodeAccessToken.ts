import { DecodedToken } from './../types/index';
import { jwtDecode } from 'jwt-decode';

export const decodeAccessToken = (
  token: string | null,
): DecodedToken | null => {
  if (!token) return null;

  // Loại bỏ tiền tố "Bearer " nếu có
  const formattedToken = token.startsWith('Bearer ')
    ? token.substring(7).trim()
    : token.trim();

  try {
    const decoded: any = jwtDecode(formattedToken);

    // Map các giá trị từ decoded token sang interface DecodedToken
    const mappedToken: DecodedToken = {
      id: decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ],
      userName:
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email:
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ],
      role: decoded[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
      exp: decoded.exp,
      avatarUrl: undefined, // hoặc có thể gán giá trị khác nếu có
    };

    return mappedToken;
  } catch (error) {
    console.error('Decode access token error:', error);
    return null;
  }
};
