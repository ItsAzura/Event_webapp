import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lấy accessToken từ cookie
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Nếu có token và đang truy cập vào /login hoặc /register, chuyển hướng về trang chủ
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu không có token và không phải trang chủ, login, register thì chuyển về login
  if (
    !token &&
    pathname !== '/' &&
    pathname !== '/login' &&
    pathname !== '/register'
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu không có điều kiện nào khớp, tiếp tục xử lý
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
