'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import toast from 'react-hot-toast';

export default function VerifyPhonePage() {
    const { login } = useAuth(); // ⬅ function to update global auth state
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email'); // ✅ get email from query params

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/verify-mobile-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Invalid OTP");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // ✅ Update AuthContext
            login(data.user, data.token);

            toast.success("Phone verified successfully 🎉");
            router.push('/'); // redirect to homepage or dashboard
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/resend-mobile-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to resend OTP");
                return;
            }

            toast.success("New OTP sent 📲");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error resending OTP");
        }
    }

    return (
        <div
            className="flex-1 flex items-center justify-center bg-cover bg-center relative h-screen"
            style={{ backgroundImage: "url('/bed.jpg')" }}
        >
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    {/* Heading */}
                    <h1 className="text-2xl font-semibold text-center mb-2">
                        Let’s confirm your number
                    </h1>
                    <p className="text-gray-600 text-center mb-6 text-sm">
                        Enter the secure code we sent to your mobile.
                    </p>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="6-digit code"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`cursor-pointer w-full font-medium py-2 rounded-md text-sm transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
                        >
                            {loading ? "Verifying..." : "Continue"}
                        </button>
                    </form>

                    {/* Resend OTP */}
                    <p className="text-center mt-4 text-sm">
                        Didn’t receive a code?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-blue-500 hover:underline"
                        >
                            Resend code
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
