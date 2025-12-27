import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, assignedToId, durationHours } = body;

        const dataToUpdate: any = {};
        if (status) dataToUpdate.status = status;
        if (assignedToId) dataToUpdate.assignedToId = assignedToId;
        if (durationHours !== undefined) dataToUpdate.durationHours = parseFloat(durationHours);
        if (status === 'REPAIRED') dataToUpdate.completedDate = new Date();

        const updatedRequest = await prisma.maintenanceRequest.update({
            where: { id },
            data: dataToUpdate
        });

        // Handle Scrap Logic
        if (status === 'SCRAP') {
            // Mark equipment as SCRAPPED
            const req = await prisma.maintenanceRequest.findUnique({ where: { id } });
            if (req) {
                await prisma.equipment.update({
                    where: { id: req.equipmentId },
                    data: { status: 'SCRAPPED' }
                });
            }
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        return NextResponse.json({ error: 'Update Failed' }, { status: 500 });
    }
}
