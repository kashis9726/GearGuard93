'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function CreateTeamPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Quick API call logic inline (normally in separate api route, but I didn't make one yet)
        // I'll make the API route next.
        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) router.push('/teams');
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="max-w-md mx-auto card p-8">
            <h1 className="text-xl font-bold mb-6">Create New Team</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Team Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rapid Response Unit"
                    required
                />
                <div>
                    <label className="text-sm font-medium text-secondary block mb-2">Description</label>
                    <textarea
                        className="w-full p-2 border border-gray-200 rounded-md bg-white h-24"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <Button type="submit" fullWidth disabled={loading}>{loading ? 'Creating...' : 'Create Team'}</Button>
            </form>
        </div>
    );
}
