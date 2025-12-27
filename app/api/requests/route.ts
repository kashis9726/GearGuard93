import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subject, equipmentId, teamId, type, description, priority, scheduledDate } = body;

        // Get user from cookie/session (mock for now, assume logged in or extract from header if we had middleware)
        // For prototype, we'll assign "CreatedBy" if we could parse the cookie, but let's leave it nullable or basic.

        // Validate
        if (!subject || !equipmentId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newRequest = await prisma.maintenanceRequest.create({
            data: {
                subject,
                equipmentId,
                teamId: teamId || undefined,
                type,
                description,
                priority,
                status: 'NEW',
                scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
            }
        });

        return NextResponse.json(newRequest);
    } catch (error) {
        console.error('Create Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
