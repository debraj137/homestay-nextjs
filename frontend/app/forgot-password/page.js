'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg('');
        setSendingOtp(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE}/auth/forgot-password/send-otp`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("OTP sent to your email")
            router.push(`/forgot-password/verify?email=${email}`);
        } catch (err) {
            // setMsg(err.message || 'Failed to send OTP');
            toast.error(err.message || 'Failed to send OTP');
        } finally {
            setSendingOtp(false);
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[url(/bed.jpg)] bg-cover bg-center relative">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Please enter your email address. We will send verification code
                </p>
                {msg && <p className="text-red-500 text-sm mb-2">{msg}</p>}

                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full border px-4 py-2 rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={sendingOtp}
                    className={`w-full py-2 rounded text-white font-semibold transition
                        ${sendingOtp
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
                        }
            `}
                >
                    {sendingOtp ? 'Sending OTP…' : 'Send OTP'}
                </button>
            </form>
        </div>
    );
}
