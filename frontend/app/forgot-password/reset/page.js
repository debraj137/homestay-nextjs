'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const email = useSearchParams().get('email');

  async function handleReset(e) {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/forgot-password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword: password }),
    });

    const data = await res.json();
    if (!res.ok) return setMsg(data.message);

    router.push('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url(/bed.jpg)] bg-cover bg-center relative">
      <form onSubmit={handleReset} className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        {msg && <p className="text-red-500 text-sm mb-2">{msg}</p>}

        <input
          type="password"
          placeholder="New password"
          required
          className="w-full border px-4 py-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded cursor-pointer">
          Reset Password
        </button>
      </form>
    </div>
  );
}
