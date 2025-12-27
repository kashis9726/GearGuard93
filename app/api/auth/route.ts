import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // In a real app, hash passwords!
        // For this demo, we check directly against the DB seeded users.
        const user = await prisma.user.findUnique({
            where: { email },
            include: { team: true } // Include team info for session
        });

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create a simple session cookie
        // In Next.js App Router, we can set cookies on the response
        const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });

        // Set cookie valid for 1 day
        response.cookies.set('user_id', user.id, { httpOnly: true, path: '/', maxAge: 86400 });
        response.cookies.set('user_role', user.role, { httpOnly: true, path: '/', maxAge: 86400 });
        response.cookies.set('user_name', user.name, { httpOnly: true, path: '/', maxAge: 86400 });
        if (user.teamId) {
            response.cookies.set('user_team_id', user.teamId, { httpOnly: true, path: '/', maxAge: 86400 });
        }

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
