import { Sidebar } from '@/components/Sidebar';
import { cookies } from 'next/headers';

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const userName = cookieStore.get('user_name')?.value;
    const userRole = cookieStore.get('user_role')?.value;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar userName={userName} userRole={userRole} />
            <main className="flex-1 overflow-y-auto p-8 ml-64">
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
