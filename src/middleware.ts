import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-for-e-commerce-platform-development-2026'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  let user: any = null;

  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      user = payload;
    } catch (e) {
      // Invalid token
    }
  }

  // 1. Guarding Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Guarding Checkout & Orders Routes
  if (pathname.startsWith('/checkout') || pathname.startsWith('/orders')) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
    }
  }

  // 3. Prevent logged-in users from visiting login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/orders/:path*', '/login', '/signup'],
};
