'use client';
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee'); // Default
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (res.ok) {
                // Auto login successful, redirect to dashboard
                const data = await res.json();
                console.log('Signup success:', data);
                router.push('/');
            } else {
                const data = await res.json();
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-main)' }}>
            <div className="card w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
                    <p className="text-slate-500 mt-1">Join GearGuard Maintenance Platform</p>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <Input
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@gearguard.com"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="Employee">Employee (Normal User)</option>
                            <option value="Technician">Technician</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">{error}</div>}

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                    <div className="mt-6 text-center text-sm text-slate-500">
                        Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
