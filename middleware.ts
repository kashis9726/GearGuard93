import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths
    const isPublicPath = path === '/login' || path === '/signup' || path.startsWith('/api/auth');

    const token = request.cookies.get('user_id')?.value;

    if (isPublicPath && token) {
        // If user is already logged in and tries to access login/signup, redirect to dashboard
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isPublicPath && !token) {
        // If user is not logged in and tries to access protected route, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Config matches everything except static files/images
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
