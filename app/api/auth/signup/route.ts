import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Create user
        // Note: Password should be hashed in production!
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password, // Storing plain text for this demo (as per existing login route logic)
                role: role || 'Employee'
            }
        });

        // Create a simple session cookie (Auto-login)
        const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });

        // Set cookie valid for 1 day
        response.cookies.set('user_id', user.id, { httpOnly: true, path: '/', maxAge: 86400 });
        response.cookies.set('user_role', user.role, { httpOnly: true, path: '/', maxAge: 86400 });
        response.cookies.set('user_name', user.name, { httpOnly: true, path: '/', maxAge: 86400 });

        // No teamId for new user yet unless we assign it, so we skip that for now

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
