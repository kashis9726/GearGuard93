import prisma from '@/lib/prisma';
import { RequestForm } from '@/components/RequestForm';

import { Suspense } from 'react';

export default async function NewRequestPage() {
    const equipment = await prisma.equipment.findMany({
        select: { id: true, name: true, serialNumber: true, category: true, defaultTeamId: true }
    });
    const teams = await prisma.team.findMany();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">New Maintenance Request</h1>
                <p className="text-secondary">Log a breakdown or schedule preventive maintenance</p>
            </div>
            <Suspense fallback={<div>Loading form...</div>}>
                <RequestForm initialEquipmentList={equipment} initialTeams={teams} />
            </Suspense>
        </div>
    );
}
