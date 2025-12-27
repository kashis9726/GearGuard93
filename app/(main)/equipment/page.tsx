import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default async function EquipmentListPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; dept?: string }>;
}) {
    const { q, dept } = await searchParams;
    const query = q || '';
    const departmentStr = dept || '';

    const equipment = await prisma.equipment.findMany({
        where: {
            AND: [
                { name: { contains: query } }, // Case insensitive usually in SQLite? Prisma handles it.
                departmentStr ? { department: { contains: departmentStr } } : {},
                { status: { not: 'SCRAPPED' } } // Hide screwed items by default? Or show all. User said "List view".
            ]
        },
        include: { defaultTeam: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>Equipment</h1>
                    <p className="text-secondary">Manage company assets</p>
                </div>
                <Link href="/equipment/new">
                    <Button>+ Add Equipment</Button>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="card p-4 flex gap-4 bg-white">
                <form className="flex gap-4 w-full">
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Search by name..."
                        className="btn border border-gray-300 flex-1 text-left"
                    />
                    <input
                        name="dept"
                        defaultValue={departmentStr}
                        placeholder="Department..."
                        className="btn border border-gray-300 w-48 text-left"
                    />
                    <Button type="submit" variant="secondary">Filter</Button>
                </form>
            </div>

            {/* List */}
            <div className="card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-sm font-semibold text-secondary">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Serial #</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Department</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map(eq => (
                            <tr key={eq.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-medium text-blue-600">
                                    <Link href={`/equipment/${eq.id}`}>{eq.name}</Link>
                                </td>
                                <td className="py-3 px-4 font-mono text-sm">{eq.serialNumber}</td>
                                <td className="py-3 px-4">{eq.category}</td>
                                <td className="py-3 px-4">{eq.department}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                ${eq.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {eq.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <Link href={`/equipment/${eq.id}`}>
                                        <Button size="sm" variant="secondary">View</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {equipment.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">No equipment found matching your filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
