'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Simple Admin Home (placeholder)
 * - Shows a friendly headline + small admin nav
 * - Redirects non-admin users to homepage
 * - Blank area for future admin widgets
 */

export default function AdminHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // while auth is loading, don't redirect yet
    if (loading) return;

    // if user exists and is not admin -> send away
    if (user && user.role !== 'admin') {
      router.push('/'); // change if you want a different non-admin landing
    }

    // if no user -> send to login
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show simple skeleton while loading or if no user yet
  if (loading || !user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-center text-gray-600">Checking access…</p>
      </div>
    );
  }

  // Admin content (blank placeholder)
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Blank area to use in future for widgets */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border rounded-lg p-6 min-h-[220px] flex items-center justify-center text-gray-500">
          Admin home page — placeholder. Add widgets (stats, quick actions) here later.
        </div>

        {/* Example small quick actions area (optional, remove if you want fully blank) */}
      </div>
    </div>
  );
}
