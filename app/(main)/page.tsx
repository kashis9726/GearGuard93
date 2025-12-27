import React from 'react';
import prisma from '@/lib/prisma';
import { Button } from '@/components/Button';
import Link from 'next/link';

// KPI Card Component
// KPI Card Component
function KpiCard({ title, value, colorClass }: { title: string, value: number, colorClass: string }) {
    return (
        <div className="card bg-white p-6 flex flex-col justify-between h-32 border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</h3>
            <div className={`text-4xl font-extrabold ${colorClass} mt-2`}>{value}</div>
        </div>
    );
}

export default async function DashboardPage() {
    // Fetch real-time data
    const totalEquipment = await prisma.equipment.count({ where: { status: { not: 'SCRAPPED' } } });
    const openRequests = await prisma.maintenanceRequest.count({ where: { status: 'NEW' } });
    const inProgress = await prisma.maintenanceRequest.count({ where: { status: 'IN_PROGRESS' } });
    const repaired = await prisma.maintenanceRequest.count({ where: { status: 'REPAIRED' } });

    // Get recent requests
    const recentRequests = await prisma.maintenanceRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { equipment: true, team: true }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of maintenance operations</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/requests/new">
                        <Button>+ New Request</Button>
                    </Link>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Equipment" value={totalEquipment} colorClass="text-blue-600" />
                <KpiCard title="Open Requests" value={openRequests} colorClass="text-red-500" />
                <KpiCard title="In Progress" value={inProgress} colorClass="text-amber-500" />
                <KpiCard title="Repaired" value={repaired} colorClass="text-emerald-500" />
            </div>

            {/* Recent Requests Section */}
            <div className="card bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Recent Requests</h2>
                    <Link href="/requests" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">View All &rarr;</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Subject</th>
                                <th className="py-4 px-6 font-semibold">Equipment</th>
                                <th className="py-4 px-6 font-semibold">Team</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentRequests.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-6 font-medium text-slate-900">{req.subject}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600 font-mono bg-slate-50 rounded mx-2">{req.equipment.name}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600">{req.team?.name || '-'}</td>
                                    <td className="py-4 px-6">
                                        <span className={`badge 
                                    ${req.status === 'NEW' ? 'badge-danger' :
                                                req.status === 'IN_PROGRESS' ? 'badge-warning' :
                                                    'badge-success'}`}>
                                            {req.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-400">{req.createdAt.toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400 italic">No maintenance requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
