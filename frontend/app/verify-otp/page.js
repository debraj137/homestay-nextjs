'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyOtpPage() {
    const [emailOtp, setEmailOtp] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const router = useRouter();
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    useEffect(() => {
        const savedEmail = localStorage.getItem('pendingEmail');
        if (savedEmail) setEmail(savedEmail);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,      // 👈 include email
                    emailOtp,
                    mobileOtp,
                }),
            });

            const data = await res.json();
            console.log('OTP response:', data);
            if (!res.ok) throw new Error(data.message);
            // localStorage.setItem('token', data.token);
            // localStorage.setItem('user', JSON.stringify(data.user));
            // ✅ Make sure login is actually called
            if (data.user && data.token) {
                login(data.user, data.token);
            } else {
                throw new Error('Missing user/token from server response');
            }
            toast.success('OTP verified successfully!');
            localStorage.removeItem('pendingEmail');
            setTimeout(() => {
                router.push('/');
            }, 100);
        } catch (err) {
            toast.error(err.message || 'OTP verification failed');
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center bg-cover bg-center relative h-screen"
            style={{ backgroundImage: "url('/bed.jpg')" }}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Enter Email OTP" value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        required className="w-full px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="Enter Mobile OTP" value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value)}
                        required className="w-full px-4 py-2 border rounded-lg" />
                    <button type="submit"
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold">
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
}
