import prisma from '@/lib/prisma';
import { KanbanBoard } from '@/components/KanbanBoard';
import { cookies } from 'next/headers';

export default async function RequestsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { equipmentId } = await searchParams;
    const cookieStore = await cookies();
    const role = cookieStore.get('user_role')?.value;
    const teamId = cookieStore.get('user_team_id')?.value;
    const userId = cookieStore.get('user_id')?.value;

    const where: any = {};

    // Filter by Equipment Smart Button
    if (equipmentId) {
        where.equipmentId = equipmentId; // Using exact string match since ID is uuid
    }

    // Technician can only see Requests assigned to their team
    if (role === 'Technician' && teamId) {
        where.teamId = teamId;
    }
    // Employee can only see their own requests
    if (role === 'Employee' && userId) {
        where.createdById = userId;
    }

    const requests = await prisma.maintenanceRequest.findMany({
        where,
        include: {
            equipment: { select: { name: true } },
            team: { select: { name: true } },
            assignedTo: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="h-full">
            <KanbanBoard initialRequests={requests as any} />
        </div>
    );
}
