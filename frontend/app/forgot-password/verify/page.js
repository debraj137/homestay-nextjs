'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState('');
    const [msg, setMsg] = useState('');
    const router = useRouter();
    const email = useSearchParams().get('email');
    // const email = 'debrajdeb137@gmail.com'

    async function handleVerify(e) {
        e.preventDefault();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/forgot-password/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();
        if (!res.ok) return setMsg(data.message);

        router.push(`/forgot-password/reset?email=${email}`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url(/bed.jpg)] bg-cover bg-center relative">
            <form onSubmit={handleVerify} className="bg-white p-6 rounded-lg shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Enter the OTP sent to <strong>{email}</strong>
                </p>
                {msg && <p className="text-red-500 text-sm mb-2">{msg}</p>}

                <input
                    type="text"
                    placeholder="Enter OTP"
                    required
                    className="w-full border px-4 py-2 rounded mb-4"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <button className="w-full bg-gray-700 hover:bg-gray-800 cursor-pointer text-white py-2 rounded">
                    Verify
                </button>
            </form>
        </div>
    );
}
