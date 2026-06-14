import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'technova_fallback_secret_key_for_development'
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const isDashboardPath = pathname.startsWith('/admin/dashboard');
  
  // Login path
  const isLoginPath = pathname === '/admin/login';

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value;

  if (isDashboardPath) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verify token
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error('Proxy JWT Error:', error);
      // Redirect to login if token is invalid
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  if (isLoginPath) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        // Redirect to dashboard if already logged in
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch {
        // Token is invalid, continue to login page
        const response = NextResponse.next();
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the proxy should run on
export const config = {
  matcher: ['/admin/:path*'],
};
