import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/components/Button';

export default async function EquipmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const equipment = await prisma.equipment.findUnique({
        where: { id },
        include: { defaultTeam: true }
    });

    if (!equipment) {
        notFound();
    }

    // Smart Button Stats
    const requestCount = await prisma.maintenanceRequest.count({
        where: {
            equipmentId: id,
            status: { not: 'REPAIRED' } // Count active/open requests
        }
    });

    // Calculate warranty status
    const isWarrantyActive = equipment.warrantyEnd ? new Date(equipment.warrantyEnd) > new Date() : false;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>{equipment.name}</h1>
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                ${equipment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}
            `}>
                            {equipment.status}
                        </div>
                    </div>
                    <p className="text-secondary mt-1 font-mono text-sm">S/N: {equipment.serialNumber}</p>
                </div>

                <div className="flex gap-3">
                    {/* Smart Button */}
                    <Link href={`/requests?equipmentId=${equipment.id}`}>
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition-all font-medium">
                            <span>🔧 Maintenance</span>
                            {requestCount > 0 && (
                                <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {requestCount}
                                </span>
                            )}
                        </button>
                    </Link>
                    <Button variant="secondary">Edit Details</Button>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card space-y-6">
                    <h3 className="text-lg font-semibold border-b border-gray-100 pb-2">Technical Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-secondary uppercase font-semibold">Category</label>
                            <p className="font-medium">{equipment.category}</p>
                        </div>
                        <div>
                            <label className="text-xs text-secondary uppercase font-semibold">Department</label>
                            <p className="font-medium">{equipment.department}</p>
                        </div>
                        <div>
                            <label className="text-xs text-secondary uppercase font-semibold">Location</label>
                            <p className="font-medium">{equipment.location}</p>
                        </div>
                        <div>
                            <label className="text-xs text-secondary uppercase font-semibold">Assigned To</label>
                            <p className="font-medium">{equipment.assignedToEmployee || 'Unassigned'}</p>
                        </div>
                    </div>
                </div>

                <div className="card space-y-6">
                    <h3 className="text-lg font-semibold border-b border-gray-100 pb-2">Maintenance & Support</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-secondary uppercase font-semibold">Default Team</label>
                            <p className="font-medium text-blue-600">{equipment.defaultTeam?.name || 'None'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-secondary uppercase font-semibold">Warranty</label>
                            <p className={`font-medium ${isWarrantyActive ? 'text-green-600' : 'text-orange-600'}`}>
                                {isWarrantyActive ? 'Active' : 'Expired'}
                            </p>
                            {equipment.warrantyEnd && <p className="text-xs text-secondary">{new Date(equipment.warrantyEnd).toLocaleDateString()}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-secondary uppercase font-semibold">Purchase Date</label>
                            <p className="font-medium">{equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
