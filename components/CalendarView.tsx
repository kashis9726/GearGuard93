'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface Task {
    id: string;
    subject: string;
    scheduledDate: Date;
    status: string;
    equipment: { name: string };
}

interface CalendarViewProps {
    tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Render Calendar Grid
    const renderDays = () => {
        const days = [];
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="bg-gray-50/50 border border-gray-100 min-h-[100px]"></div>);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayTasks = tasks.filter(t => {
                const tDate = new Date(t.scheduledDate);
                return tDate.getDate() === d && tDate.getMonth() === month && tDate.getFullYear() === year;
            });

            days.push(
                <div key={d} className="bg-white border border-gray-100 min-h-[100px] p-2 hover:bg-gray-50 transition-colors group relative">
                    <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm text-gray-700">{d}</span>
                        <Link href={`/requests/new?type=PREVENTIVE&scheduledDate=${dateStr}`}>
                            <button className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 font-bold hover:underline">
                                + Add
                            </button>
                        </Link>
                    </div>

                    <div className="mt-2 space-y-1">
                        {dayTasks.map(t => (
                            <div key={t.id} className={`text-xs p-1 rounded truncate border-l-2 ${t.status === 'NEW' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                                    t.status === 'REPAIRED' ? 'bg-green-50 border-green-500 text-green-700' :
                                        'bg-orange-50 border-orange-500 text-orange-700'
                                }`}>
                                {t.subject}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="btn btn-secondary">Previous</button>
                <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
                <button onClick={nextMonth} className="btn btn-secondary">Next</button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-sm font-bold text-gray-500">
                        {day}
                    </div>
                ))}
                {renderDays()}
            </div>
        </div>
    );
}
