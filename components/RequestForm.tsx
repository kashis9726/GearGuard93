'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface RequestFormProps {
    initialEquipmentList: any[];
    initialTeams: any[];
}

export function RequestForm({ initialEquipmentList, initialTeams }: RequestFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedEquipmentId = searchParams.get('equipmentId');

    const [formData, setFormData] = useState({
        subject: '',
        equipmentId: preSelectedEquipmentId || '',
        category: '',
        teamId: '',
        type: 'CORRECTIVE',
        scheduledDate: '',
        description: '',
        priority: 'MEDIUM'
    });

    const [loading, setLoading] = useState(false);

    // Auto-fill logic when Equipment changes
    useEffect(() => {
        if (formData.equipmentId) {
            const eq = initialEquipmentList.find(e => e.id === formData.equipmentId);
            if (eq) {
                setFormData(prev => ({
                    ...prev,
                    category: eq.category,
                    teamId: eq.defaultTeamId || prev.teamId // Auto-fill team
                }));
            }
        }
    }, [formData.equipmentId, initialEquipmentList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                router.push('/requests');
                router.refresh();
            } else {
                alert('Failed to create request');
            }
        } catch (err) {
            alert('Error creating request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6">Create Maintenance Request</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <Input
                            label="Subject"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            required
                            placeholder="e.g. Conveyor Belt Stuck"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-secondary block mb-2">Equipment</label>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-md bg-white"
                            value={formData.equipmentId}
                            onChange={e => setFormData({ ...formData, equipmentId: e.target.value })}
                            required
                        >
                            <option value="">Select Equipment</option>
                            {initialEquipmentList.map(eq => (
                                <option key={eq.id} value={eq.id}>{eq.name} (S/N: {eq.serialNumber})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Input
                            label="Category (Auto)"
                            value={formData.category}
                            readOnly
                            className="bg-gray-50 opacity-80"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-secondary block mb-2">Assigned Team (Auto)</label>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-md bg-white"
                            value={formData.teamId}
                            onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                            required // Can be changed if needed
                        >
                            <option value="">Select Team</option>
                            {initialTeams.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-secondary block mb-2">Type</label>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-md bg-white"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="CORRECTIVE">Corrective (Breakdown)</option>
                            <option value="PREVENTIVE">Preventive (Routine)</option>
                        </select>
                    </div>

                    {formData.type === 'PREVENTIVE' && (
                        <div>
                            <Input
                                label="Scheduled Date"
                                type="date"
                                value={formData.scheduledDate}
                                onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="col-span-2">
                        <label className="text-sm font-medium text-secondary block mb-2">Description</label>
                        <textarea
                            className="w-full p-2 border border-gray-200 rounded-md bg-white h-24"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Request'}</Button>
                </div>
            </form>
        </div>
    );
}
