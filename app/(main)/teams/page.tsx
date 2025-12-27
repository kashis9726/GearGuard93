import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Button } from '@/components/Button';

export default async function TeamsPage() {
    const teams = await prisma.team.findMany({
        include: {
            _count: { select: { members: true, requests: true } }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Maintenance Teams</h1>
                    <p className="text-secondary">Manage technical squads and assignments</p>
                </div>
                <Link href="/teams/create">
                    <Button>+ Create Team</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                    <div key={team.id} className="card bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-800">{team.name}</h3>
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-100">
                                {team._count.members} Techs
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">{team.description || 'No description available for this team.'}</p>

                        <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-4 mt-auto">
                            <span className="font-medium text-slate-700">{team._count.requests} Active Jobs</span>
                            <button className="text-blue-600 font-medium hover:text-blue-800 hover:underline">Manage &rarr;</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
