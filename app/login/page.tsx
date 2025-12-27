'use client';
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/'); // Go to dashboard
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An expected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-main)' }}>
            <div className="card w-full max-w-md p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>GearGuard</h1>
                    <p className="text-secondary mt-1">Maintenance Management System</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@gearguard.com"
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

                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account? <a href="/signup" className="text-blue-600 hover:underline font-medium">Sign Up</a>
                    </div>

                    <div className="mt-4 text-center text-sm text-secondary pt-4 border-t border-gray-100">
                        <p>Demo Credentials:</p>
                        <p className="font-mono text-xs mt-1">admin@gearguard.com / password123</p>
                        <p className="font-mono text-xs">employee@gearguard.com / password123</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
