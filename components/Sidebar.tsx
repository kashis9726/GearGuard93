'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Equipment', href: '/equipment' },
    { label: 'Requests', href: '/requests' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Teams', href: '/teams', role: 'Admin' }, // Basic role check placeholder
];

export function Sidebar({ userName = 'User Profile', userRole }: { userName?: string; userRole?: string }) {
    const pathname = usePathname();

    // Get initials
    const initials = userName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'US';

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col border-r shadow-sm z-10" style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <h1 className="text-2xl font-bold tracking-tight text-blue-600" style={{ color: 'var(--primary)' }}>GearGuard</h1>
                <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Maintenance Tracker</div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    // Hide items if role doesn't match (Basic check)
                    if (item.role && item.role !== userRole && userRole !== 'Admin') return null;

                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors`}
                            style={{
                                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
                            }}
                        >
                            {/* Icons can go here */}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                        {initials}
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold" style={{ color: 'var(--text-main)' }}>{userName}</p>
                        <p className="text-xs text-slate-500">{userRole || 'View Account'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
