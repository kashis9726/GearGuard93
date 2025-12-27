'use client';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/Button';
import Link from 'next/link';

interface Request {
    id: string;
    subject: string;
    status: string;
    priority: string;
    equipment: { name: string };
    team?: { name: string };
    assignedTo?: { name: string };
}

interface KanbanBoardProps {
    initialRequests: Request[];
}

const COLUMNS = {
    NEW: 'New',
    IN_PROGRESS: 'In Progress',
    REPAIRED: 'Repaired',
    SCRAP: 'Scrap'
};

export function KanbanBoard({ initialRequests }: KanbanBoardProps) {
    // Group requests by status
    const [requests, setRequests] = useState(initialRequests);

    const getRequestsByStatus = (status: string) => requests.filter(r => r.status === status);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;

        // Optimistic UI Update
        const updatedRequests = requests.map(req => {
            if (req.id === draggableId) {
                return { ...req, status: newStatus };
            }
            return req;
        });
        setRequests(updatedRequests);

        // Call API
        try {
            await fetch(`/api/requests/${draggableId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (err) {
            console.error("Failed to update status", err);
            // Revert on failure (omitted for brevity)
        }
    };

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Maintenance Requests</h1>
                <Link href="/requests/new">
                    <Button>+ New Request</Button>
                </Link>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-[calc(100vh-200px)] overflow-x-auto pb-4">
                    {Object.entries(COLUMNS).map(([statusKey, statusLabel]) => (
                        <div key={statusKey} className="flex-1 min-w-[280px] bg-slate-100 rounded-lg p-4 flex flex-col" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-700">{statusLabel}</h3>
                                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                                    {getRequestsByStatus(statusKey).length}
                                </span>
                            </div>

                            <Droppable droppableId={statusKey}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex-1 flex flex-col gap-3 overflow-y-auto"
                                    >
                                        {getRequestsByStatus(statusKey).map((req, index) => (
                                            <Draggable key={req.id} draggableId={req.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`card p-3 border-l-4 shadow-sm hover:shadow-md transition-shadow
                                                    ${req.priority === 'HIGH' ? 'border-l-red-500' : 'border-l-blue-500'}`}
                                                        style={{ background: 'white' }}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-xs font-mono text-gray-500">{req.equipment.name}</span>
                                                            {req.assignedTo && (
                                                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold">
                                                                    {req.assignedTo.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium text-sm mb-2">{req.subject}</h4>
                                                        <div className="flex justify-between items-center text-xs text-secondary">
                                                            <span>{req.team?.name || 'Unassigned'}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
