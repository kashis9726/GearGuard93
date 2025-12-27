import prisma from '@/lib/prisma';
import { CalendarView } from '@/components/CalendarView';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default async function CalendarPage() {
    // Fetch only PREVENTIVE tasks
    const preventiveTasks = await prisma.maintenanceRequest.findMany({
        where: {
            type: 'PREVENTIVE',
            scheduledDate: { not: null } // Ensure date exists
        },
        include: {
            equipment: { select: { name: true } }
        }
    });

    // Map to simple structure for component
    const tasks = preventiveTasks.map(t => ({
        id: t.id,
        subject: t.subject,
        scheduledDate: t.scheduledDate!,
        status: t.status,
        equipment: { name: t.equipment.name }
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>Preventive Calendar</h1>
                    <p className="text-secondary">Schedule and track routine maintenance</p>
                </div>
                <Link href="/requests/new?type=PREVENTIVE">
                    <Button>+ Schedule Maintenance</Button>
                </Link>
            </div>

            <CalendarView tasks={tasks} />
        </div>
    );
}
